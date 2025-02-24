import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Picture } from '../../pictures/entities/picture.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @OneToMany(() => Picture, (picture) => picture.car)
  img: Picture[];

  @Column()
  color: string;

  @Column()
  passengers: number;

  @Column()
  ac: boolean;

  @Column()
  pricePerDay: number;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;
}
