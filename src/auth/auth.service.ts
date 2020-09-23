import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentsEntity } from '../entities/students.entity';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(StudentsEntity)
        private readonly studentsRepo: Repository<StudentsEntity>,
        private readonly jwtService: JwtService,
    ){}


    public async validateUser(email: string, password: string) {
        return await this.studentsRepo.findOne({ where: { stu_email: email } }).then( async student => {
            const isValid = await student.comparePassword(password);
            if(isValid) {
                return student.toJSON();
            }
        }).catch(() => null);
    }

    public async login(payload: Object) {
        const access_token = this.jwtService.sign(payload);
        return JSON.parse(`{ "access_token": "${access_token}" }`);
    }
}
