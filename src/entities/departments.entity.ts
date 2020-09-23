import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('departments')
export class DepartmentsEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
