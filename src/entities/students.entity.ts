import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  stu_password: string;

  @Column()
  stu_degree: number;

  @Column()
  stu_year: string; 
}
