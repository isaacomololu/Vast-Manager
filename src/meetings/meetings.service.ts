import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common';
import { DatabaseProvider } from 'src/database/database.provider';
import { CreateMeetingDto, SetStatusDto, UpdateMeetingDto } from './dtos';
import { Status } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class MeetingsService extends BaseService {
    constructor(
        private readonly prisma: DatabaseProvider,
    ) {
        super();
    }

    async getAllMeetings(
        query: {
            [x: string]: any;
        } = {},
        status?: Status,
        { pageSize = 10, page = 1 } = {}
    ) {

        const take = Number(pageSize);
        const skip = (Number(page) - 1) * take;

        const whereClause = {
            ...query,
            ...(status ? { status } : {}),
        };

        const [meetings, total] = await Promise.all([
            await this.prisma.meeting.findMany({
                where: whereClause,
                skip: skip,
                take: take,
                orderBy: {
                    createdAt: 'desc'
                },
            }),

            await this.prisma.meeting.count({
                where: whereClause,
            })
        ])

        if (!meetings) {
            return this.HandleError(new NotFoundException('No meetings found'));
        }

        return this.Results({
            meetings, metaData: {
                page,
                pageSize,
                total,
            }
        })

    }

    async getMeetingById(userId: string, id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return this.HandleError(new NotFoundException('User not found'));
        }

        const meeting = await this.prisma.meeting.findUnique({
            where: {
                id,
            },
        });

        if (!meeting) {
            return this.HandleError(new NotFoundException('Meeting not found'));
        }

        return this.Results(meeting);
    }

    async createMeeting(userId: string, payload: CreateMeetingDto) {
        const { title, description, startTime, date, duration, ...createDetails } = payload;

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return this.HandleError(new NotFoundException('User not found'));
        }

        const setStartTime = new Date(startTime);
        console.log('startTime', startTime);
        console.log('setStartTime', setStartTime);

        const endTime = new Date(setStartTime.getTime() + (duration * 60 * 1000));
        console.log('endTime', endTime);
        console.log('duration', duration);
        const meetingDate = new Date(date);

        const meeting = await this.prisma.meeting.create({
            data: {
                title,
                description,
                startTime: setStartTime,
                endTime,
                date: meetingDate,
                ...createDetails,
                userId,
            },
        });

        return this.Results(meeting);
    }

    async updateMeeting(userId: string, id: string, payload: UpdateMeetingDto) {
        const { title, description, startTime, duration, date, timezone, location, isRecurring, ...updateDetails } = payload;

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return this.HandleError(new NotFoundException('User not found'));
        }

        const meeting = await this.prisma.meeting.findUnique({
            where: {
                id,
            },
        });
        if (!meeting) {
            return this.HandleError(new NotFoundException('Meeting not found'));
        }

        const updateData: any = {
            title,
            description,
            timezone,
            location,
            isRecurring,
            ...updateDetails
        };

        if (date) {
            updateData.date = new Date(date);
        }

        if (startTime) {
            const startTimeDate = new Date(startTime);
            updateData.startTime = startTimeDate;

            if (duration) {
                updateData.endTime = new Date(startTimeDate.getTime() + (duration * 60 * 1000));
            }

            else if (meeting.endTime) {
                const existingDurationMs = meeting.endTime.getTime() - meeting.startTime.getTime();
                updateData.endTime = new Date(startTimeDate.getTime() + existingDurationMs);
            }
        }

        else if (duration && !startTime) {
            updateData.endTime = new Date(meeting.startTime.getTime() + (duration * 60 * 1000));
        }

        const updatedMeeting = await this.prisma.meeting.update({
            where: {
                id,
            },
            data: updateData,
        });

        return this.Results(updatedMeeting);
    }

    async deleteMeeting(userId: string, id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return this.HandleError(new NotFoundException('User not found'));
        }

        const meeting = await this.prisma.meeting.findUnique({
            where: {
                id,
            },
        });
        if (!meeting) {
            return this.HandleError(new NotFoundException('Meeting not found'));
        }

        await this.prisma.meeting.delete({
            where: {
                id,
            },
        });

        return this.Results(null);
    }

    async userSetMeetingStatus(userId: string, id: string, payload: SetStatusDto) {
        const { status } = payload;

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return this.HandleError(new NotFoundException('User not found'));
        }

        const meeting = await this.prisma.meeting.findUnique({
            where: {
                id,
            },
        });

        if (!meeting) {
            return this.HandleError(new NotFoundException('Meeting not found'));
        }

        if (meeting.userId !== userId) {
            return this.HandleError(new ForbiddenException('You are not authorized to update this meeting'));
        }

        const updatedMeeting = await this.prisma.meeting.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });

        return this.Results(updatedMeeting);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async setMeetingStatus() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const updatedMeetings = await this.prisma.meeting.updateMany({
            where: {
                startTime: {
                    gte: today,
                    lt: tomorrow,
                },
                status: Status.UPCOMING,
            },
            data: {
                status: Status.TODAY,
            },
        })

        const updatedPastMeetings = await this.prisma.meeting.updateMany({
            where: {
                date: {
                    lt: today
                },
                status: {
                    in: [Status.UPCOMING, Status.TODAY]
                }
            },
            data: {
                status: Status.COMPLETED
            }
        });

        return this.Results({
            updatedMeetings,
            updatedPastMeetings
        });
    }
}
