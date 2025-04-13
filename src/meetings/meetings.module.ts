import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationGateway } from 'src/notification/notification.gateway';
@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  providers: [MeetingsService, NotificationGateway],
  controllers: [MeetingsController]
})
export class MeetingsModule { }
