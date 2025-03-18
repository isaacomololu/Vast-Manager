import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { BaseController } from 'src/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/common/interfaces';

@UseGuards(AuthGuard)
@ApiBearerAuth('jwt')
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

  @Get('one')
  async findOne(@Req() request: Request) {
    console.log('controller user', request.user);

    const user = request.user as User;
    return this.userService.findOne(user.userId);


    // if (user.isError) throw user.error;

    // return this.response({
    //   message: 'Account Retrived',
    //   data: user.data,
    // })
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() form: UpdateUserDto) {
  //   const user = await this.userService.updateUser(id, form);

  //   if (user.isError) throw user.error;

  //   return this.response({
  //     message: 'Account Updated',
  //     data: user.data,
  //   })
  // }

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
