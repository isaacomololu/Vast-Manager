import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { BaseController } from 'src/common';
import { AuthGuard } from 'src/common/';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/common/interfaces';
import { ChangeNameDto } from './dto';

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
  async getUserProfile(@Req() request: Request) {
    console.log('controller user', request.user);

    const user = request.user as User;
    return this.userService.getUserProfile(user.userId);


    // if (user.isError) throw user.error;

    // return this.response({
    //   message: 'Account Retrived',
    //   data: user.data,
    // })
  }

  @Patch(':id')
  async changeName(@Param('id') id: string, @Body() form: ChangeNameDto) {
    const user = await this.userService.changeName(id, form);

    if (user.isError) throw user.error;

    return this.response({
      message: 'Names Updated',
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
