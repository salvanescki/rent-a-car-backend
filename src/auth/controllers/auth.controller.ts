import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthLoginUserDto } from '../dto/auth-login-user.dto';
import { AuthRegisterUserDto } from '../dto/auth-register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
    return this.authService.registerUser(authRegisterUserDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginUserDto: AuthLoginUserDto) {
    return this.authService.authenticateUser(authLoginUserDto);
  }
}
