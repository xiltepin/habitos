import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, OneToMany, JoinColumn
} from 'typeorm';
import { User } from '../users/user.entity';
import { Completion } from '../completions/completion.entity';

export type HabitType = 'good' | 'bad';
export type HabitFrequency = '1' | '2' | '3' | '4' | '5' | '6' | '7' | 'daily' | 'weekly' | 'custom';
export type HabitTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  color: string;

  @Column({ default: 'good' })
  type: HabitType;

  @Column({ default: '7' })
  frequency: HabitFrequency;

  // For weekly: comma-separated days (0=Sun,1=Mon,...,6=Sat)
  @Column({ nullable: true })
  frequencyDays: string;

  @Column({ default: 'anytime' })
  timeOfDay: HabitTimeOfDay;

  @Column({ nullable: true })
  reminderTime: string; // HH:MM

  @Column({ default: 1 })
  targetCount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.habits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Completion, (c) => c.habit)
  completions: Completion[];
}