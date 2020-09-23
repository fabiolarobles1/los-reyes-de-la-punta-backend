import { Exclude } from 'class-transformer/decorators';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { StudentResponseInterface } from '../students/interfaces/student.response.interface';

@Entity('students')
export class StudentsEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stu_id: string;

  @Column()
  stu_fname: string;

  @Column()
  stu_lname: string;

  @Column()
  stu_email: string;

  @Column()
  @Exclude()
  stu_password: string;

  @Column()
  stu_degree: number;

  @Column()
  stu_year: string;

  @BeforeInsert()
  async hashPassword() {
    this.stu_password = await bcrypt.hash(this.stu_password, 10);
  }

  async comparePassword(input: string) {
    return await bcrypt.compare(input, this.stu_password);
  }

  toJSON(): StudentResponseInterface {
    return <StudentResponseInterface>classToPlain(this);
  }
  
}
