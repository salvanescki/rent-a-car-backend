import { IsEmail, IsString, Matches } from 'class-validator';

export class AuthRegisterUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'Invalid Password' },
  )
  password: string;
}
