import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Car } from '../../cars/entities/car.entity';
import { CarPicture } from '../enums/car-picture.enum';

@Entity()
export class Picture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Car, (car) => car.img)
  car: Car;

  @Column()
  src: string;

  @Column()
  description: string;

  @Column()
  title: string;

  @Column()
  type: CarPicture;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;
}
