import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  role: string; // admin, manager, rep

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  tenant: Tenant;
}
