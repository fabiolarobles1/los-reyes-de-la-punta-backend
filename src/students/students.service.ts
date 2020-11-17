import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentsEntity } from '../entities/departments.entity';
import { CoursesEntity } from '../entities/courses.entity';
import { StudentsEntity } from '../entities/students.entity';
import { EnrollmentEntity } from '../entities/enrollment_table.entity';
import { SectionsEntity } from '../entities/sections.entity';


@Injectable()
export class StudentsService {

    constructor(
        @InjectRepository(DepartmentsEntity)
        private readonly departmentsRepo: Repository<DepartmentsEntity>

        ,@InjectRepository(CoursesEntity)
        private readonly coursesRepo: Repository<CoursesEntity>

        ,@InjectRepository(EnrollmentEntity)
        private readonly enrollmentRepo: Repository<EnrollmentEntity>

        ,@InjectRepository(SectionsEntity)
        private readonly sectionsRepo: Repository<SectionsEntity>

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
    public async enroll_course(stu_id: number, section_id:number) {
        
        if ((await this.sectionsRepo.findOne({where:{id:section_id}})).Capacity - await this.enrollmentRepo.count({where:{Section_id:section_id}})>0){
            const enroll = new EnrollmentEntity();
            enroll.Student_id = stu_id;
            enroll.Section_id = section_id;
            return await this.enrollmentRepo.save(enroll).then((res)=>res);
        }

        else {return "Section has maximum capacity"}
    }
    
    public async withdraw_course(stu_id: number, section_id:number) {
        const enroll = new EnrollmentEntity();
            enroll.Student_id = stu_id;
            enroll.Section_id = section_id;
            return await this.enrollmentRepo.delete(enroll).then((res)=>res); 
    }

    public async searchSections(search: string) {
        return await this.sectionsRepo
        .createQueryBuilder('s')
        .leftJoin('professors', 'p', 's.Professor = p.id')
        .leftJoin('courses', 'c', 's.Courses_id = c.id')
        .where(`MATCH(c.name, c.description) AGAINST ('${search}')`)
        .select([
            's.id as SECTION_ID',
            's.time as time',
            's.Capacity as capacity',
            's.Room as room',
            's.Days as days',
            's.Additional_Information as extra_info',
            'c.credits as credits',
            'c.name as course',
            'p.name as professor'
        ]).execute()
    }
}


