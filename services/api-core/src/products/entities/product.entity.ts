import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceUnit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceCase: number;

  @Column({ default: 1 })
  unitsPerCase: number;

  @Column({ default: 0 })
  stockQuantity: number;
}
