import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sections')
export class SectionsEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Courses_id: number;

  @Column()
  section: string;

  @Column()
  Credits: number;

  @Column()
  Time: string;

  @Column()
  Days: string;

  @Column()
  Room: string;

  @Column()
  Capacity: number;

  @Column()
  Professor: string;

  @Column()
  Additional_Information: string;


}