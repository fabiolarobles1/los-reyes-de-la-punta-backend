import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentsEntity } from '../entities/departments.entity';
import { CoursesEntity } from '../entities/courses.entity';
import { StudentsEntity } from '../entities/students.entity';

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

    public async getCurrentCourses(stu_year) {
        return await this.coursesRepo.find({ where: { year: stu_year , semestre:1 } }).then(res => res).catch(err => err);
    }

    public async getNextSemesterCourses(stu_year) {
        return await this.coursesRepo.find({ where: { year: stu_year , semestre: 2} }).then(res => res).catch(err => err);
    }

    public async searchCourses(name: string) {
        return await this.coursesRepo.createQueryBuilder("courses").where("courses.name like :name OR courses.description like :description",{ name:`%${name}%`,description:`%${name}%`}).getMany();
        
    }

}
