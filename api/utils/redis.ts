import redis from 'redis'
import config from '../config'
import bluebird from 'bluebird'

class Redis {
  private _redis = null

  constructor () {
    bluebird.promisifyAll(redis)
    this._redis = redis.createClient(config.datastores.redis.url)
  }

  /**
   * Set Redis Key
   * @param key
   * @param val
   * @param expire expire after seconds
   */
  set (key: string, val: any, expire: number = 0) {
    if (expire > 0) this._redis.set(key, val, 'EX', expire)
    else this._redis.set(key, val)
  }

  /**
   * Get Redis Value
   * @param key
   */
  async get (key: string): Promise<any> {
    return this._redis.getAsync(key)
  }

  async hgetAsync (key: string, subKey: any): Promise<any> {
    return this._redis.hgetAsync(key, subKey)
  }

  async hgetallAsync (key: string): Promise<any> {
    return this._redis.hgetallAsync(key)
  }

  hset (key: string, subKey: string, data: any) {
    this._redis.hset(key, subKey, data)
  }

  del (keys: any[]): boolean {
    return this._redis.del(keys)
  }

  /**
   * Memory Destructor
   */
  release () {
    this._redis.quit()
  }
}

export default Redis
