import { createConnection } from 'mysql2/promise'
import config from '../config'
// a
class DBManager {
  private connections: Object = {}

  async getConnection (datastoreKey: string) {
    if (!datastoreKey) return null
    if (this.connections.hasOwnProperty(datastoreKey)) return this.connections[datastoreKey]

    this.connections[datastoreKey] = await createConnection(Object.assign({ connectTimeout: 20000 }, config.datastores[datastoreKey]))

    return this.connections[datastoreKey]
  }

  /**
   * Memory Destructor
   */
  async release () {
    Object.keys(this.connections).forEach(datastoreKey => {
      this.connections[datastoreKey].end()
      delete this.connections[datastoreKey]
    })
  }

  /**
   * Exrtract Helpers
   */
  async fetchRows (sql, params: any[] = [], dbConfigName: string = 'default'): Promise<any[]> {
    const conn = await this.getConnection(dbConfigName)
    const queryResult = await conn.query(sql, params)
    if (!queryResult[0]) return null
    const data: any[] = queryResult[0]

    const ret = data.map(row => {
      return Object.entries(row).reduce((r, [k, v]) => {
        r[k] = v
        return r
      }, {})
    })

    return ret
  }

  async fetchOne (sql, params: any[] = [], dbConfigName: string = 'default'): Promise<any> {
    const ret = await this.fetchRows(sql, params, dbConfigName)
    return (ret) ? ret.shift() : null
  }
}

export default DBManager
