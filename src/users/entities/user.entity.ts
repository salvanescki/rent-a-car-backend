import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Document } from '../../documents/entities/document.entity';
import { Role } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column()
  country: string;

  @Column({ default: Role.client })
  role: Role;

  @OneToMany(() => Document, (document) => document.author)
  documents: Document[];

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;
}
