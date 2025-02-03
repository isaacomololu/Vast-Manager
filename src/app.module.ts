import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [AuthModule, UserModule, CoreModule],
})
export class AppModule { }
