import { AuthRegisterUserDto } from '../dto/auth-register-user.dto';
import { AuthLoginUserDto } from '../dto/auth-login-user.dto';
import { AuthChangePasswordUserDto } from '../dto/auth-change-password-user.dto';
import { AuthForgotPasswordUserDto } from '../dto/auth-forgot-password-user.dto';
import { AuthConfirmPasswordUserDto } from '../dto/auth-confirm-password-user.dto';

export interface IAuthService {
  signUp(authRegisterUserDto: AuthRegisterUserDto);
  signIn(authLoginUserDto: AuthLoginUserDto);
  changePassword(authChangePasswordUserDto: AuthChangePasswordUserDto);
  forgotPassword(authForgotPasswordUserDto: AuthForgotPasswordUserDto);
  confirmPassword(authConfirmPasswordUserDto: AuthConfirmPasswordUserDto);
}
