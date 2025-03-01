import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto } from './dto';
import { BaseController } from 'src/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('signup')
  async signUp(@Body() form: CreateUserDto) {
    const user = await this.authService.signUp(form)

    if (user.isError) throw user.error;

    return this.response({
      message: 'Account Created',
      data: user.data,
    });
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() form: LoginUserDto) {
    const user = await this.authService.login(form);

    if (user.isError) throw user.error;

    return this.response({
      message: 'Login Successful',
      data: user.data,
    });
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('logout')
  // async logout() {
  //   const user = await this.authService.logout();

  //   if (user.isError) throw user.error;

  //   return this.response({
  //     message: 'Login Successful',
  //     data: user.data,
  //   });
  // }
}
