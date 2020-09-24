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

    public async login(payload: any) {
        const access_token = this.jwtService.sign(payload);
        return JSON.parse(`{ "access_token": "${access_token}" }`);
    }

    public async signup(payload: any) {
        const newUser = new StudentsEntity();
        newUser.stu_degree = payload.degree;
        newUser.stu_email = payload.email;
        newUser.stu_fname = payload.first_name;
        newUser.stu_lname = payload.last_name;
        newUser.stu_id = payload.stu_id;
        newUser.stu_password = payload.password;
        newUser.stu_year = payload.stu_year;

        //Create user and log him in
        return await this.studentsRepo.save(newUser)
            .then(async (student: StudentsEntity) => {
                const token = this.login(student.toJSON());
                return token;
            });
    }
}
