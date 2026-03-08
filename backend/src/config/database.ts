import { DataSource } from 'typeorm'
import { User } from '../models/User'
import { Profile } from '../models/Profile'
import { Scheme } from '../models/Scheme'
import { Application } from '../models/Application'
import { Document } from '../models/Document'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yojanasaathi',
  entities: [User, Profile, Scheme, Application, Document],
  synchronize: process.env.NODE_ENV !== 'production', // Disable in production
  logging: process.env.NODE_ENV === 'development',
  connectTimeout: 10000,
  extra: {
    connectionLimit: 10,
  },
})
