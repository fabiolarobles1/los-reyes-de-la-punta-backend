import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('degrees')
export class DegreesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  credits: string;

  @Column()
  department: number;

}
