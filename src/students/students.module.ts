import { StudentsService } from './students.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { DegreesEntity } from '../entities/degrees.entity';
import { StudentsEntity } from '../entities/students.entity';
import { DepartmentsEntity } from '../entities/departments.entity';
import { StudentsController } from './students.controller';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                DegreesEntity,
                StudentsEntity,
                DepartmentsEntity
            ]
        ),
        JwtModule.register({
            secret: 'asdasdaswdasdas',
            signOptions: { expiresIn: '2 days' }
        })
    ],
    exports: [TypeOrmModule, StudentsService],
    controllers: [StudentsController],
    providers: [
        StudentsService,
        AuthService
    ],
})
export class StudentsModule {}
