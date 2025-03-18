import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/common';
import { LocalStrategy } from 'src/common/strategies/local.strategy';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    // JwtModule.register({
    //   // secret: config.JWT_SECRET,
    // secret: process.env.JWT_SECRET,
    // signOptions: { expiresIn: '1h' },
    // }),
    // JwtModule.registerAsync({
    //   useFactory: () => ({
    //     secret: config.JWT_SECRET,
    //     signOptions: { expiresIn: '1h' },
    //   }),
    //   global: true
    // })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],

})
export class AuthModule { }
