import { AppDataSource } from '../config/database'
import { Scheme } from '../models/Scheme'
import { AppError } from '../middleware/error.middleware'

// Redis is optional - only use if configured
let redis: any = null
let useRedis = false

if (process.env.REDIS_HOST) {
  try {
    const Redis = require('ioredis')
    const { redisConfig } = require('../config/redis')
    redis = new Redis(redisConfig)
    useRedis = true
    redis.on('error', () => {
      useRedis = false
    })
  } catch (err) {
    useRedis = false
  }
}

const CACHE_TTL = 3600 // 1 hour

export class SchemeService {
  async getAllSchemes(filters?: {
    category?: string
    level?: string
    search?: string
    language?: string
  }) {
    // Try to get from cache only if Redis is available
    if (useRedis && redis) {
      try {
        const cacheKey = `schemes:${JSON.stringify(filters || {})}`
        const cached = await redis.get(cacheKey)
        if (cached) {
          return JSON.parse(cached)
        }
      } catch (err) {
        // Ignore cache errors
      }
    }

    const schemeRepo = AppDataSource.getRepository(Scheme)
    const query = schemeRepo.createQueryBuilder('scheme')

    // Apply filters
    if (filters?.category) {
      query.andWhere('scheme.category = :category', { category: filters.category })
    }

    if (filters?.level) {
      query.andWhere('scheme.level = :level', { level: filters.level })
    }

    if (filters?.search) {
      const lang = filters.language || 'en'
      const nameField = `name_${lang}`
      query.andWhere(`scheme.${nameField} ILIKE :search`, { search: `%${filters.search}%` })
    }

    query.andWhere('scheme.is_ongoing = :isOngoing', { isOngoing: true })

    const schemes = await query.getMany()

    // Cache the results only if Redis is available
    if (useRedis && redis) {
      try {
        const cacheKey = `schemes:${JSON.stringify(filters || {})}`
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(schemes))
      } catch (err) {
        // Ignore cache errors
      }
    }

    return schemes
  }

  async getSchemeById(schemeId: string, language: string = 'en') {
    // Try to get from cache only if Redis is available
    if (useRedis && redis) {
      try {
        const cacheKey = `scheme:${schemeId}:${language}`
        const cached = await redis.get(cacheKey)
        if (cached) {
          return JSON.parse(cached)
        }
      } catch (err) {
        // Ignore cache errors
      }
    }

    const schemeRepo = AppDataSource.getRepository(Scheme)
    const scheme = await schemeRepo.findOne({ where: { scheme_id: schemeId } })

    if (!scheme) {
      throw new AppError('Scheme not found', 404)
    }

    // Cache the result only if Redis is available
    if (useRedis && redis) {
      try {
        const cacheKey = `scheme:${schemeId}:${language}`
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(scheme))
      } catch (err) {
        // Ignore cache errors
      }
    }

    return scheme
  }

  async searchSchemes(query: string, language: string = 'en') {
    const schemeRepo = AppDataSource.getRepository(Scheme)
    const nameField = `name_${language}` as keyof Scheme
    const descField = `description_${language}` as keyof Scheme

    const schemes = await schemeRepo
      .createQueryBuilder('scheme')
      .where(`scheme.${nameField} ILIKE :query`, { query: `%${query}%` })
      .orWhere(`scheme.${descField} ILIKE :query`, { query: `%${query}%` })
      .andWhere('scheme.is_ongoing = :isOngoing', { isOngoing: true })
      .getMany()

    return schemes
  }

  async compareSchemes(schemeIds: string[]) {
    const schemeRepo = AppDataSource.getRepository(Scheme)
    const schemes = await schemeRepo.findByIds(schemeIds)

    if (schemes.length !== schemeIds.length) {
      throw new AppError('One or more schemes not found', 404)
    }

    return schemes
  }

  async invalidateCache(schemeId?: string) {
    if (!useRedis || !redis) {
      return // Skip if Redis not available
    }
    
    try {
      if (schemeId) {
        const keys = await redis.keys(`scheme:${schemeId}:*`)
        if (keys.length > 0) {
          await redis.del(...keys)
        }
      } else {
        const keys = await redis.keys('schemes:*')
        if (keys.length > 0) {
          await redis.del(...keys)
        }
      }
    } catch (err) {
      // Ignore cache errors
    }
  }
}

export default new SchemeService()
