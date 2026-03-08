import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'
import { Application } from './Application'

@Entity('schemes')
export class Scheme {
  @PrimaryGeneratedColumn('uuid')
  scheme_id!: string

  @Column({ unique: true })
  scheme_code!: string

  @Column({ type: 'text' })
  name_en!: string

  @Column({ type: 'text', nullable: true })
  name_hi?: string

  @Column({ type: 'text', nullable: true })
  name_ta?: string

  @Column({ type: 'text', nullable: true })
  name_te?: string

  @Column({ type: 'text', nullable: true })
  name_bn?: string

  @Column({ type: 'text', nullable: true })
  description_en?: string

  @Column({ type: 'text', nullable: true })
  description_hi?: string

  @Column({ type: 'text', nullable: true })
  description_ta?: string

  @Column({ type: 'text', nullable: true })
  description_te?: string

  @Column({ type: 'text', nullable: true })
  description_bn?: string

  @Column()
  category!: string

  @Column()
  level!: string

  @Column({ nullable: true })
  department?: string

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  benefit_amount?: number

  @Column({ type: 'date', nullable: true })
  deadline?: Date

  @Column({ default: true })
  is_ongoing!: boolean

  @CreateDateColumn()
  created_at!: Date

  @OneToMany(() => Application, (application) => application.scheme)
  applications?: Application[]
}
