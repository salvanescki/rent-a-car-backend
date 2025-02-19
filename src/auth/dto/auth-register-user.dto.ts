import { IsEmail, IsEnum, Matches } from 'class-validator';
import { Role } from '../../users/enums/role.enum';

export class AuthRegisterUserDto {
  @IsEmail()
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'Invalid Password' },
  )
  password: string;

  @IsEnum(Role)
  role: Role;
}
