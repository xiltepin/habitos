import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('weights')
export class Weight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 5, scale: 2 })
  weight: number; // in kg

  @Column('date')
  date: string; // YYYY-MM-DD format

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
