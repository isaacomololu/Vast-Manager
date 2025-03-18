import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUp, ChangePasswordDto, RefreshTokenDto } from './dto';
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
  async signUp(@Body() form: SignUp) {
    const user = await this.authService.signUp(form)

    if (user.isError) throw user.error;

    return this.response({
      message: 'Account Created',
      data: user.data,
    });
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() form: LoginDto) {
    const user = await this.authService.login(form);

    if (user.isError) throw user.error;

    return this.response({
      message: 'Login Successful',
      data: user.data,
    });
  }

  @Post('refresh')
  async refreshTokens(@Body() form: RefreshTokenDto) {
    const token = await this.authService.refreshTokens(form);

    if (token.isError) throw token.error;

    return this.response({
      message: 'Login Successful',
      data: token.data,
    });
  }

  // @Post('forgot-password')
  // async forgotPassword(@Body() { email }: { email: string }) {
  //   // const forgot = await this.authService.forgotPassword(email);

  //   // return this.response({
  //   //   message: 'Password Reset Link Sent',
  //   //   // data: forgot.data,
  //   // });
  // }

  // @UseGuards(AuthGuard)
  // @Put('change-password')
  // async changePassword(@Body() form: ChangePasswordDto) {
  //   // const pass = this.authService.changePassword(form);

  //   // if (pass.isError) throw pass.error;
  //   // return this.response({
  //   //   message: 'Password Changed',
  //   //   data: pass.data,
  //   // });
  // }
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
