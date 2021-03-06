import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DepartmentsEntity } from '../entities/departments.entity';
import { CoursesEntity } from '../entities/courses.entity';
import { StudentsEntity } from '../entities/students.entity';
import { EnrollmentEntity } from '../entities/enrollment_table.entity';
import { SectionsEntity } from '../entities/sections.entity';
import { SavedSectionsEntity } from '../entities/saved.sections.entity';


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

        ,@InjectRepository(SavedSectionsEntity)
        private readonly savedSectionsRepo: Repository<SavedSectionsEntity>



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

        //Validar semestre del curso
        const semester= await this.sectionsRepo.createQueryBuilder('s')
        .leftJoin('courses', 'c', 's.Courses_id = c.id')
        .where('s.id = :id',{id:section_id})
        .select([
            'c.semestre'
        ]).execute()

        if(semester[0]['c_semestre']==1){
            return "This section is for the first semester"
        }
        else{

            if ((await this.sectionsRepo.findOne({where:{id:section_id}})).Capacity - await this.enrollmentRepo.count({where:{Section_id:section_id}})>0){
                const enroll = new EnrollmentEntity();
                enroll.Student_id = stu_id;
                enroll.Section_id = section_id;
                return await this.enrollmentRepo.save(enroll).then((res)=>res);
            }

            else {return "Section has maximum capacity"}
    }
}
    public async withdraw_course(stu_id: number, sectionids: number[]) {
        return await this.enrollmentRepo.delete({ Student_id: stu_id, Section_id: In([sectionids]) }).then((res)=>res); 
    }

    public async searchSections(search: string, semestre: number) {
        return await this.sectionsRepo
        .createQueryBuilder('s')
        .leftJoin('professors', 'p', 's.Professor = p.id')
        .leftJoin('courses', 'c', 's.Courses_id = c.id')
        .where(`(:search IS NULL OR MATCH(c.name, c.description, c.regular_name) AGAINST (:search IN BOOLEAN MODE) ) AND (:semestre IS NULL OR c.semestre = :semestre)`, { 
            search: search !== null ? search+'*' : search,
            semestre: semestre
        })
        .select([
            's.id as SECTION_ID',
            's.section as section',
            's.time as time',
            's.Capacity as capacity',
            's.Room as room',
            's.Days as days',
            's.Additional_Information as extra_info',
            'c.credits as credits',
            'c.name as course',
            'p.name as professor',
            'c.regular_name',
            `
            (SELECT secs.Capacity - count(e.Section_id)
            from enrollment_table e
            join sections secs on e.Section_id = secs.id
            WHERE secs.id = s.id) as spaces
            `
        ]).execute()
    }


    public async student_enrollment(stu_id: number) {
        return await this.enrollmentRepo.createQueryBuilder('e')
        .leftJoin('sections', 's', 'e.Section_id= s.id')
        .leftJoin('courses', 'c', 's.Courses_id = c.id')
        .leftJoin('professors', 'p', 's.Professor = p.id')
        .where('e.Student_id = :Student_id',{Student_id:stu_id})
        .select([
            's.id as SECTION_ID',
            's.section as section',
            'c.name as course',
            'c.regular_name as regular_name',
            'c.credits as credits',
            's.Capacity as capacity',
            's.time as time',
            's.Days as days',
            's.Room as room',
            'p.name as professor',
            's.Additional_Information as extra_info',
            'c.semestre as semester',
            `
            (SELECT secs.Capacity - count(e.Section_id)
            from enrollment_table e
            join sections secs on e.Section_id = secs.id
            WHERE secs.id = s.id) as spaces
            `
        ]).execute()
    }

    public async saveSection(userID: number, sections: number[]) {
        const newSections: SavedSectionsEntity[] = sections.map(e => {
            const newItem = new SavedSectionsEntity();
            newItem.student_id = userID;
            newItem.section_id = e;
            return newItem
        });
        return await this.savedSectionsRepo.createQueryBuilder()
                        .insert().orIgnore(true).into(SavedSectionsEntity).values(newSections).execute();
    }

    public async getSavedSections(userID: number) {
        return await this.savedSectionsRepo.createQueryBuilder('e')
        .leftJoin('sections', 's', 's.id = e.section_id')
        .leftJoin('courses', 'c', 'c.id = s.Courses_id')
        .leftJoin('professors', 'p', 'p.id = s.Professor')
        .where('e.student_id = :student_id',{ student_id: userID })
        .select([
            's.id as SECTION_ID',
            's.section as section',
            'c.name as course',
            'c.regular_name as regular_name',
            'c.credits as credits',
            's.Capacity as capacity',
            's.time as time',
            's.Days as days',
            's.Room as room',
            'p.name as professor',
            's.Additional_Information as extra_info',
            'c.semestre as semester',
            `
            (SELECT secs.Capacity - count(e.Section_id)
            from enrollment_table e
            join sections secs on e.Section_id = secs.id
            WHERE secs.id = s.id) as spaces
            `
        ]).execute()
    }

    public async removeSavedSection(userID: number, sections: number[]) {
        return await this.savedSectionsRepo.delete({ student_id: userID, section_id: In(sections) });
    }
}


