import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { DatabaseProvider } from 'src/database/database.provider';
import { BaseService } from 'src/common';
import { ChangeNameDto } from './dto';

@Injectable()
export class UserService extends BaseService {
  constructor(private prisma: DatabaseProvider) {
    super();
  }

  async findAll() { // add pagination
    const users = await this.prisma.user.findMany();
    return this.Results(users);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return this.HandleError(
        new NotFoundException('User not found')
      )
    };

    return this.Results(user);
  }

  async changeName(id: string, payload: ChangeNameDto) {
    const { firstName, lastName } = payload;

    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return this.HandleError(
        new NotFoundException('User not found')
      )
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName
      }
    })

    return this.Results(updatedUser);
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return this.HandleError(
        new NotFoundException('User not found')
      )
    };

    await this.prisma.user.delete({
      where: { id }
    });

    return this.Results(null);
  }
}
