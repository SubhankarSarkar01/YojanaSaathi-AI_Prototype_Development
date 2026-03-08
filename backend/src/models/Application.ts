import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { User } from './User'
import { Scheme } from './Scheme'
import { Document } from './Document'

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  application_id!: string

  @Column({ type: 'uuid' })
  user_id!: string

  @Column({ type: 'uuid' })
  scheme_id!: string

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @ManyToOne(() => Scheme, (scheme) => scheme.applications)
  @JoinColumn({ name: 'scheme_id' })
  scheme!: Scheme

  @Column({ default: 'draft' })
  status!: string

  @Column({ type: 'timestamp', nullable: true })
  submitted_at?: Date

  @Column({ type: 'int', default: 0 })
  completion_percentage!: number

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @OneToMany(() => Document, (document) => document.application)
  documents?: Document[]
}
