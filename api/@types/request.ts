import { Request as _Request } from 'express'
import DB from '../utils/db'
import Redis from '../utils/redis'

export interface Request extends _Request {
  db: DB,
  redis: Redis,
  user: any
}
