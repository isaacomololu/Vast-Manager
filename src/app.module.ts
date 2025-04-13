import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './common/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/common';
import { MeetingsModule } from './meetings/meetings.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    DatabaseModule,
    EmailModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: config.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
      global: true
    }),
    MeetingsModule,
    NotificationModule
  ],
})
export class AppModule { }
