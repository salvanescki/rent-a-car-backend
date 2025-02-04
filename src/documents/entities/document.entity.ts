import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  src: string;

  @Column()
  description: string;

  @Column()
  title: string;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('uuid')
  authorId: string;

  @ManyToOne(() => User, (user) => user.documents)
  author: User;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;
}
