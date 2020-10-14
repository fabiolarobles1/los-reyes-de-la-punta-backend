import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentsEntity } from '../entities/departments.entity';
import { CoursesEntity } from '../entities/courses.entity';

@Injectable()
export class StudentsService {

    constructor(
        @InjectRepository(DepartmentsEntity)
        private readonly departmentsRepo: Repository<DepartmentsEntity>

        ,@InjectRepository(CoursesEntity)
        private readonly coursesRepo: Repository<CoursesEntity>
    ){}

    public async getDepartments() {
        return await this.departmentsRepo.find({ select: ['name'] }).then(res => res).catch(err => err);
    }

    public async getCourses() {
        return await this.coursesRepo.find({ select: ['name',"description"]}).then(res => res).catch(err => err);
    }
    
}
