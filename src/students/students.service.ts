import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentsEntity } from '../entities/departments.entity';

@Injectable()
export class StudentsService {

    constructor(
        @InjectRepository(DepartmentsEntity)
        private readonly departmentsRepo: Repository<DepartmentsEntity>
    ){}

    public async getDepartments() {
        return await this.departmentsRepo.find({ select: ['name'] }).then(res => res).catch(err => err);
    }
}
