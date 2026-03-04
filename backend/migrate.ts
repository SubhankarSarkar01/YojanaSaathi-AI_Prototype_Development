import { createConnection } from 'typeorm'
import { databaseConfig } from './src/config/database'
import fs from 'fs'
import path from 'path'
import logger from './src/utils/logger'

async function runMigrations() {
  try {
    logger.info('Connecting to database...')
    const connection = await createConnection(databaseConfig)

    logger.info('Running migrations...')
    const migrationsDir = path.join(__dirname, 'database/migrations')
    const files = fs.readdirSync(migrationsDir).sort()

    for (const file of files) {
      if (file.endsWith('.sql')) {
        logger.info(`Running migration: ${file}`)
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
        await connection.query(sql)
        logger.info(`✅ Completed: ${file}`)
      }
    }

    logger.info('✅ All migrations completed successfully')
    await connection.close()
    process.exit(0)
  } catch (error) {
    logger.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
