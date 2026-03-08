import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm'
import { Profile } from './Profile'
import { Application } from './Application'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string

  @Column({ unique: true, nullable: true })
  email?: string

  @Column({ nullable: true })
  password_hash?: string

  @Column({ nullable: true })
  full_name?: string

  @Column({ nullable: true })
  mobile_number?: string

  @Column({ default: 'user' })
  role!: string // 'user' or 'admin'

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @OneToOne(() => Profile, (profile) => profile.user)
  profile?: Profile

  @OneToMany(() => Application, (application) => application.user)
  applications?: Application[]
}
