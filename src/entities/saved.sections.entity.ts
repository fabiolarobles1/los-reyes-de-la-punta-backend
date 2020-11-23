import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('saved_sections')
export class SavedSectionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: number;

  @Column()
  section_id: number;
}
