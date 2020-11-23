import { Body, Controller, Get, Param, Post, UseGuards, Request, Req, Query, ParseIntPipe, NotAcceptableException, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local.auth.guard';
import { StudentsService } from './students.service';
import { CoursesEntity } from '../entities/courses.entity';
import { EnrollmentEntity } from '../entities/enrollment_table.entity';
import { SectionsEntity } from '../entities/sections.entity';

@Controller('students')
export class StudentsController {

    constructor(
        private readonly studentService: StudentsService,
        private readonly authService: AuthService,
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
        const searchInput = body.name;
        return this.studentService.searchCourses(searchInput).then(res => res).catch(err => err) 
    }

    @UseGuards(JwtAuthGuard)
    @Post('enroll_course')
    public async enroll_course(@Req() req, @Body() body) {
        const student= req.user
        const stuId = student.id
        

        const section = body.sectionId
        return this.studentService.enroll_course(stuId,section).then(res => res).catch(err => err)

    }

    @UseGuards(JwtAuthGuard)
    @Post('withdraw_course')
    public async withdraw_course(@Req() req, @Body() body) {
        const student= req.user
        const stuId = student.id
        const section = body.sectionId

        return this.studentService.withdraw_course(stuId,section).then(res => res).catch(err => err)
    }

    @UseGuards(JwtAuthGuard)
    @Get('search_sections')
    public async searchSections(@Query('search') search: string, @Query('semestre') semestre: number) {
        if(search !== null && search !== undefined) {
            search = search.trim().toUpperCase();
        } else {
            search = null
        }

        if(semestre === null || semestre === undefined) {
            semestre = null;
        }

        return this.studentService.searchSections(search, semestre).then(res => res).catch(err => err)
    }

    @UseGuards(JwtAuthGuard)
    @Get('student_enrollment')
    public async student_enrollment(@Req() req) {
        const student= req.user
        const stuId = student.id
        return this.studentService.student_enrollment(stuId).then(res => res).catch(err => err)
    }

    @UseGuards(JwtAuthGuard)
    @Post('save_section/:id')
    public async saveSection(@Req() req, @Param('id', ParseIntPipe) sectionID: number) {
        const userID = req.user.id;
        return this.studentService.saveSection(userID, sectionID).then(() => JSON.stringify({ message: "section successfully saved!" }) );;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('remove_section/:id')
    public async removeSavedSection(@Req() req, @Param('id', ParseIntPipe) sectionID: number) {
        const userID = req.user.id;
        return this.studentService.removeSavedSection(userID, sectionID).then(() => JSON.stringify({ message: "section successfully removed!" }) );
    }

    @UseGuards(JwtAuthGuard)
    @Get('saved_sections')
    public async getSavedSections(@Req() req) {
        const userID = req.user.id;
        return this.studentService.getSavedSections(userID);
    }

}

