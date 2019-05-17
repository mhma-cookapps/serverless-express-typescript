import redis from 'redis'
import config from '../config'
import bluebird from 'bluebird'

class RedisManager {
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
  set (key: string, val: any, expire: number) {
    this._redis.set(key, val, 'EX', expire)
  }

  async get (key: string) {
    const value = await this._redis.getAsync(key)
    return value
  }

  /**
   * Memory Destructor
   */
  release () {
    this._redis.quit()
  }
}

export default RedisManager
