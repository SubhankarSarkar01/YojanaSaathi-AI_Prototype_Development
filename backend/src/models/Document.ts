import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Application } from './Application'

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  document_id!: string

  @Column({ type: 'uuid' })
  application_id!: string

  @ManyToOne(() => Application, (application) => application.documents)
  @JoinColumn({ name: 'application_id' })
  application!: Application

  @Column()
  document_type!: string

  @Column({ type: 'text' })
  file_path!: string

  @Column({ type: 'json', nullable: true })
  ocr_data?: Record<string, any>

  @Column({ default: false })
  is_verified!: boolean

  @CreateDateColumn()
  uploaded_at!: Date
}
