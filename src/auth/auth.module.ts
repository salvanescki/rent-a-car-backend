import { Module } from '@nestjs/common';
import { CognitoService } from './services/cognito.service';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [CognitoService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
