import { DataSource } from 'typeorm'
import { User } from '../models/User'
import { Profile } from '../models/Profile'
import { Scheme } from '../models/Scheme'
import { Application } from '../models/Application'
import { Document } from '../models/Document'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yojanasaathi',
  entities: [User, Profile, Scheme, Application, Document],
  synchronize: true, // Auto-create tables in development
  logging: process.env.NODE_ENV === 'development',
})
