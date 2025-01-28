import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ){}

    createUser(user: CreateUserDto){
        const newUser = this.usersRepository.create(user);
        this.usersRepository.save(newUser);
    }

    getUsers(): Promise<User[]> {
        return this.usersRepository.find();
    }

    getUserById(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({id});
    }
}
