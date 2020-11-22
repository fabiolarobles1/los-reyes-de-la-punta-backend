import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('enrollment_table')
export class EnrollmentEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Student_id: number;

  @Column()
  Section_id: number;
}
