import DB from '../../utils/db'
import Redis from '../../utils/redis'

export abstract class BaseModel {
  protected tableName: string
  protected db: DB
  protected redis: Redis
}
