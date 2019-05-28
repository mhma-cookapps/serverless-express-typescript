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
  async get (key: string) {
    const value = await this._redis.getAsync(key)
    return value
  }

  async hgetAsync (key: string, subKey: any) {
    const res = await this._redis.hgetAsync(key, subKey)
    return res
  }

  async hgetallAsync (key: string) {
    const res = await this._redis.hgetallAsync(key)
    return res
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
