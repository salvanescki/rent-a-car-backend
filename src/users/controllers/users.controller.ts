import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Get()
    getUsers(): Promise<User[]>{
        return this.usersService.getUsers();
    }

    @Post()
    createUser(@Body() newUser: CreateUserDto) {
        this.usersService.createUser(newUser);
    }

}
