import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseController } from 'src/common';

@Controller('user')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    if (users.isError) throw users.error;

    return this.response({
      message: 'Users Retrived',
      data: users.data
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    if (user.isError) throw user.error;

    return this.response({
      message: 'Account Retrived',
      data: user.data,
    })
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() form: UpdateUserDto) {
    const user = await this.userService.updateUser(id, form);

    if (user.isError) throw user.error;

    return this.response({
      message: 'Account Updated',
      data: user.data,
    })
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.deleteUser(id);

    if (user.isError) throw user.error;

    return this.response({
      message: 'Account Updated',
      data: user.data,
    })
  }
}
