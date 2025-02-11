import { Injectable } from '@nestjs/common';
import { IAuthService } from '../interface/auth-service.interface';
import {
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import {
  AdminConfirmSignUpCommand,
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { AuthLoginUserDto } from '../dto/auth-login-user.dto';
import { AuthRegisterUserDto } from '../dto/auth-register-user.dto';
import { AuthChangePasswordUserDto } from '../dto/auth-change-password-user.dto';
import { AuthForgotPasswordUserDto } from '../dto/auth-forgot-password-user.dto';
import { AuthConfirmPasswordUserDto } from '../dto/auth-confirm-password-user.dto';
import { Role } from '../../users/enums/role.enum';

@Injectable()
export class CognitoService implements IAuthService {
  private userPool: CognitoUserPool;
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID as string,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID as string,
      endpoint: process.env.AWS_COGNITO_ENDPOINT,
    });

    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_COGNITO_ENDPOINT,
    });
  }

  async signUp({ email, password, role }: AuthRegisterUserDto) {
    const normalizedRole = role?.toString() || Role.client.toString();

    const newUser = await new Promise<CognitoUser>((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({
            Name: 'custom:role',
            Value: normalizedRole,
          }),
        ],
        [],
        (err, result) =>
          err
            ? reject(new Error(err.message || 'Registration failed.'))
            : result?.user
              ? resolve(result.user)
              : reject(new Error('Sign-up failed, user is undefined.')),
      );
    });

    await this.cognitoClient.send(
      new AdminConfirmSignUpCommand({
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
        Username: email,
      }),
    );

    return newUser;
  }

  async signIn({ email, password }: AuthLoginUserDto) {
    return this.cognitoClient
      .send(
        new InitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        }),
      )
      .then((response) => ({
        accessToken: response.AuthenticationResult?.AccessToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
      }))
      .catch((err) => {
        throw new Error(
          err instanceof Error ? err.message : 'Authentication failed.',
        );
      });
  }

  async changePassword({
    email,
    currentPassword,
    newPassword,
  }: AuthChangePasswordUserDto) {
    return this.cognitoClient
      .send(
        new InitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: currentPassword,
          },
        }),
      )
      .then((authResponse) => {
        const accessToken = authResponse.AuthenticationResult?.AccessToken;
        if (!accessToken) {
          throw new Error('Authentication failed: No access token received.');
        }

        return this.cognitoClient.send(
          new ChangePasswordCommand({
            PreviousPassword: currentPassword,
            ProposedPassword: newPassword,
            AccessToken: accessToken,
          }),
        );
      })
      .then(() => ({ status: 'Password changed successfully' }))
      .catch((err) => {
        throw new Error(
          err instanceof Error
            ? err.message
            : 'An error occurred, password not changed.',
        );
      });
  }

  async forgotPassword({ email }: AuthForgotPasswordUserDto) {
    return this.cognitoClient
      .send(
        new ForgotPasswordCommand({
          ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
          Username: email,
        }),
      )
      .then(() => ({ status: 'Password reset initiated' }))
      .catch((err) => {
        throw new Error(
          err instanceof Error
            ? err.message
            : 'An error occurred while resetting the password.',
        );
      });
  }

  async confirmPassword({
    email,
    confirmationCode,
    newPassword,
  }: AuthConfirmPasswordUserDto) {
    return this.cognitoClient
      .send(
        new ConfirmForgotPasswordCommand({
          ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
          Username: email,
          ConfirmationCode: confirmationCode,
          Password: newPassword,
        }),
      )
      .then(() => ({ status: 'Password reset successfully' }))
      .catch((err) => {
        throw new Error(
          err instanceof Error
            ? err.message
            : 'An error occurred while confirming the password.',
        );
      });
  }
}
