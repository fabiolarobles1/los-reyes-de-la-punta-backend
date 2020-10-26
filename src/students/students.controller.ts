import { Body, Controller, Get, Param, Post, UseGuards, Request, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local.auth.guard';
import { StudentsService } from './students.service';
import { CoursesEntity } from '../entities/courses.entity';

@Controller('students')
export class StudentsController {

    constructor(
        private readonly studentService: StudentsService,
        private readonly authService: AuthService
        ) {}

    @Get('departments')
    public async getDepartments() {
        return this.studentService.getDepartments().then(res => res).catch(err => err);
    }

    @Post('signup')
    public async signUp(@Body() payload: any) {
        return this.authService.signup(payload).then(token => token).catch(err => err);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    public async login(@Request() req) {
        console.log(req.user);
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('courses_firstSemester')
    public async getCurrentCourses(@Req() req) {
        const student = req.user;
        const stuYear = student.stu_year
        return this.studentService.getCurrentCourses(stuYear).then(res => res).catch(err => err);
    }
    @UseGuards(JwtAuthGuard)
    @Get('courses_secondSemester')
    public async getNextSemesterCourses(@Req() req) {
        const student = req.user;
        const stuYear = student.stu_year
        return this.studentService.getNextSemesterCourses(stuYear).then(res => res).catch(err => err);
    }
    @UseGuards(JwtAuthGuard)
    @Post('search_courses')
    public async searchCourses(@Body() body) {
        return this.studentService.searchCourses(body).then(res => res).catch(err => err) 
    }
}

