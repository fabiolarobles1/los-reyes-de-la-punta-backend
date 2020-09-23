import { Controller, Get } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {

    constructor(private readonly studentService: StudentsService) {}

    @Get('departments')
    public async getDepartments() {
        return this.studentService.getDepartments().then(res => res).catch(err => err);
    }
}
