import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local.auth.guard';
import { StudentsService } from './students.service';

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

    @Get('courses')
    public async getCourses () {
        return this.studentService.getCourses().then(res => res).catch(err => err);
    }
}
