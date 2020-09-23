import { StudentsService } from './students.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { DegreesEntity } from '../entities/degrees.entity';
import { StudentsEntity } from '../entities/students.entity';
import { DepartmentsEntity } from '../entities/departments.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                DegreesEntity,
                StudentsEntity,
                DepartmentsEntity
            ]
        )
    ],
    exports: [TypeOrmModule, StudentsService],
    controllers: [],
    providers: [
        StudentsService 
    ],
})
export class StudentsModule {}
