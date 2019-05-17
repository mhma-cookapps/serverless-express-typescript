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
  fetchRows (queryResult: any[]): any[] {
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

  fetchOne (queryResult: any[]): any {
    const result = this.fetchRows(queryResult)
    return (result) ? result.shift() : null
  }
}

export default DBManager
