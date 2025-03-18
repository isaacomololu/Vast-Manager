import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  SignUp,
  ChangePasswordDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto
} from './dto';
import { BaseController, AuthGuard } from 'src/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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

  // @UseGuards(AuthGuard('local'))
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

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(
    @Req() request,
    @Body() form: ChangePasswordDto
  ) {
    const password = await this.authService.changePassword(request.user.userId, form);

    if (password.isError) throw password.error;
    return this.response({
      message: 'Password Changed',
      data: password.data,
    });
  }

  // @ApiBearerAuth('jwt')
  // @UseGuards(AuthGuard)
  @Post('forgot-password')
  async forgotPassword(
    @Req() request,
    @Body() form: ForgotPasswordDto
  ) {
    const data = await this.authService.forgotPassword(form);

    if (data.isError) throw data.error;
    return this.response({
      message: 'Password Reset Email Sent',
      data: data.data,
    });
  }

  @Put('reset-password')
  async resetPassword(
    @Body() form: ResetPasswordDto
  ) {
    const password = await this.authService.resetPassword(form);
    if (password.isError) throw password.error;

    return this.response({
      message: 'Password Changed',
      data: password.data,
    });
  }
}
