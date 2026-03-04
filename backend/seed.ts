import { createConnection } from 'typeorm'
import { databaseConfig } from './src/config/database'
import fs from 'fs'
import path from 'path'
import logger from './src/utils/logger'

async function runSeeds() {
  try {
    logger.info('Connecting to database...')
    const connection = await createConnection(databaseConfig)

    logger.info('Running seed scripts...')
    const seedsDir = path.join(__dirname, 'database/seeds')
    const files = fs.readdirSync(seedsDir).sort()

    for (const file of files) {
      if (file.endsWith('.sql')) {
        logger.info(`Running seed: ${file}`)
        const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8')
        await connection.query(sql)
        logger.info(`✅ Completed: ${file}`)
      }
    }

    logger.info('✅ All seeds completed successfully')
    await connection.close()
    process.exit(0)
  } catch (error) {
    logger.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

runSeeds()
