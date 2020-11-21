import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courses')
export class CoursesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  department: number;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column()
  semestre: number;

  @Column()
  credits: number;

  @Column()
  description: string;

  @Column()
  regular_name: string;

}
