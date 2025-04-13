import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, BaseController } from 'src/common';
import { MeetingsService } from './meetings.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from 'src/common/interfaces';
import { CreateMeetingDto, GetAllMeetingsDto, SetStatusDto, UpdateMeetingDto } from './dtos';
import { Status } from '@prisma/client';

@ApiBearerAuth('jwt')
@UseGuards(AuthGuard)
@Controller('meetings')
export class MeetingsController extends BaseController {
    constructor(private readonly meetingsService: MeetingsService) {
        super();
    }

    @Get('')
    async getAllMeetings(@Query() query: GetAllMeetingsDto) {
        const { pageSize, page, status, ...rest } = query;

        // const statusEnum = status ? status as Status : undefined;

        const meetings = await this.meetingsService.getAllMeetings(
            rest,
            status,
            { pageSize: pageSize || 10, page: page || 1 }
        );
        if (meetings.isError) return meetings.error;

        return this.response({
            message: 'Meetings fetched successfully',
            data: meetings.data,
        })
    }

    @Get(':id')
    async getMeetingById(
        @Req() request: Request,
        @Param('id') id: string
    ) {
        const user = request.user as User;

        const meeting = await this.meetingsService.getMeetingById(
            user?.userId,
            id
        );
        if (meeting.isError) return meeting.error;

        return this.response({
            message: 'Meeting fetched successfully',
            data: meeting.data,
        })
    }

    @Post('create')
    async createMeeting(
        @Req() request: Request,
        @Body() form: CreateMeetingDto
    ) {
        const user = request.user as User;

        const meeting = await this.meetingsService.createMeeting(
            user?.userId,
            form
        );
        if (meeting.isError) return meeting.error;

        return this.response({
            message: 'Meeting created successfully',
            data: meeting.data,
        })
    }

    @Patch('update:id')
    async updateMeeting(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() form: UpdateMeetingDto
    ) {
        const user = request.user as User;

        const meeting = await this.meetingsService.updateMeeting(
            user?.userId,
            id,
            form
        );
        if (meeting.isError) return meeting.error;

        return this.response({
            message: 'Meeting updated successfully',
            data: meeting.data,
        })
    }

    @Delete('delete')
    async deleteMeeting(
        @Req() request: Request,
        @Query('id') id: string
    ) {
        const user = request.user as User;

        const meeting = await this.meetingsService.deleteMeeting(
            user?.userId,
            id
        );
        if (meeting.isError) return meeting.error;

        return this.response({
            message: 'Meeting deleted successfully',
            data: meeting.data,
        })
    }

    @Patch('status:id')
    async userSetMeetingStatus(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() form: SetStatusDto
    ) {
        const user = request.user as User;
        const meeting = await this.meetingsService.userSetMeetingStatus(
            user?.userId,
            id,
            form
        );
        if (meeting.isError) return meeting.error;

        return this.response({
            message: 'Meeting status updated successfully',
            data: meeting.data,
        })
    }

    @Patch('status')
    async setMeetingStatus() {
        const meeting = await this.meetingsService.setMeetingStatus();
        if (meeting.isError) return meeting.error;

        return this.response({
            message: 'Meeting status updated successfully',
            data: meeting.data,
        })
    }
}
