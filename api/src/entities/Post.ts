import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { User } from './User';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Length(1, 255)
  title!: string;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.posts, { eager: true, nullable: false })
  @JoinColumn({ name: 'author_id'})
  author!: User;
}
