import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common';
import { DatabaseProvider } from 'src/database/database.provider';
import { CreateMeetingDto, UpdateMeetingDto } from './dtos';

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
        { pageSize = 10, page = 1 } = {}
    ) {
        const whereClause = { ...query };

        const [meetings, total] = await Promise.all([
            await this.prisma.meeting.findMany({
                where: whereClause,
                skip: (page - 1) * pageSize,
                take: pageSize,
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
        const { title, description, ...createDetails } = payload;

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return this.HandleError(new NotFoundException('User not found'));
        }

        const meeting = await this.prisma.meeting.create({
            data: {
                title,
                description,
                ...createDetails,
                userId,
            },
        });

        return this.Results(meeting);
    }

    async updateMeeting(userId: string, id: string, payload: UpdateMeetingDto) {
        const { title, description, ...updateDetails } = payload;

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

        const updatedMeeting = await this.prisma.meeting.update({
            where: {
                id,
            },
            data: {
                title,
                description,
                ...updateDetails,
            },
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
}
