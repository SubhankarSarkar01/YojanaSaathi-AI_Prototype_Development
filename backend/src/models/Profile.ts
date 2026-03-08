import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { User } from './User'

@Entity('user_profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  profile_id!: string

  @Column({ type: 'uuid' })
  user_id!: string

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ type: 'date', nullable: true })
  date_of_birth?: Date

  @Column({ nullable: true })
  gender?: string

  @Column({ nullable: true })
  state?: string

  @Column({ nullable: true })
  district?: string

  @Column({ nullable: true })
  pin_code?: string

  @Column({ nullable: true })
  category?: string

  @Column({ nullable: true })
  occupation?: string

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  annual_income?: number

  @Column({ type: 'int', nullable: true })
  family_size?: number

  @Column({ nullable: true })
  education_qualification?: string

  @Column({ type: 'text', nullable: true })
  aadhaar_document?: string

  @Column({ type: 'text', nullable: true })
  pan_document?: string

  @Column({ type: 'text', nullable: true })
  voter_card_document?: string

  @Column({ type: 'int', default: 0 })
  profile_completeness!: number

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
