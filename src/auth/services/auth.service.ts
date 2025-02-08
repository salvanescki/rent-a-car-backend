import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthLoginUserDto } from '../dto/auth-login-user.dto';
import { AuthRegisterUserDto } from '../dto/auth-register-user.dto';
import { AuthChangePasswordUserDto } from '../dto/auth-change-password-user.dto';
import { AuthForgotPasswordUserDto } from '../dto/auth-forgot-password-user.dto';
import { AuthConfirmPasswordUserDto } from '../dto/auth-confirm-password-user.dto';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID as string,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID as string,
      endpoint: process.env.AWS_COGNITO_ENDPOINT,
    });
  }

  async registerUser(authRegisterUserDto: AuthRegisterUserDto) {
    const { name, email, password } = authRegisterUserDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'name',
            Value: name,
          }),
        ],
        [],
        (err, result) => {
          if (err) {
            reject(
              new Error(
                err.message || 'An error occurred while registering the user.',
              ),
            );
          } else if (result && result.user) {
            resolve(result.user);
          } else {
            reject(new Error('Sign-up failed, user is undefined.'));
          }
        },
      );
    });
  }

  async authenticateUser(authLoginUserDto: AuthLoginUserDto) {
    const { email, password } = authLoginUserDto;

    const cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_COGNITO_ENDPOINT,
    });

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    try {
      const response = await cognitoClient.send(command);
      return {
        accessToken: response.AuthenticationResult?.AccessToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
      };
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    }
  }

  async changeUserPassword(
    authChangePasswordUserDto: AuthChangePasswordUserDto,
  ) {
    const { email, currentPassword, newPassword } = authChangePasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: currentPassword,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          userCognito.changePassword(
            currentPassword,
            newPassword,
            (err, result) => {
              if (err) {
                reject(
                  new Error(
                    err.message ||
                      'An error occurred while changing the user password.',
                  ),
                );
              } else {
                resolve(result);
              }
            },
          );
        },
        onFailure: (err: Error) => {
          reject(err);
        },
      });
    });
  }

  async forgotUserPassword(
    authForgotPasswordUserDto: AuthForgotPasswordUserDto,
  ) {
    const { email } = authForgotPasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err: Error) => {
          reject(err);
        },
      });
    });
  }

  async confirmUserPassword(
    authConfirmPasswordUserDto: AuthConfirmPasswordUserDto,
  ) {
    const { email, confirmationCode, newPassword } = authConfirmPasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.confirmPassword(confirmationCode, newPassword, {
        onSuccess: () => {
          resolve({ status: 'success' });
        },
        onFailure: (err: Error) => {
          reject(err);
        },
      });
    });
  }
}
