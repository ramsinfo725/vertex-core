import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'basic' })
  plan: string;

  @Column('json', { nullable: true })
  features: any;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];
}
