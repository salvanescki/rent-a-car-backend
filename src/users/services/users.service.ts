import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async _findUserById(id: string): Promise<User> {
    const userFound = await this.usersRepository.findOne({
      where: { id },
      relations: ['documents'],
    });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    return userFound;
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const userFound = await this.usersRepository.findOneBy({
      email: user.email,
    });

    if (userFound) {
      throw new ConflictException(
        `A user has already been registered with the email ${user.email}`,
      );
    }

    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUserById(id: string): Promise<User> {
    return this._findUserById(id);
  }

  async deleteUser(id: string) {
    const result = await this.usersRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    return result;
  }

  async updateUser(id: string, user: UpdateUserDto) {
    await this._findUserById(id);
    return this.usersRepository.update({ id }, user);
  }
}
