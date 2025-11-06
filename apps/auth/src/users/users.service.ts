import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.create({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  findUser({ email, id }: { email?: string; id?: string }) {
    return this.usersRepository.findOne({ $or: [{ email }, { _id: id }] });
  }
}
