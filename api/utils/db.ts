import { createConnection, escapeId } from 'mysql2/promise'
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
  async query (sql, params: any[] = [], dbConfigName: string = 'default'): Promise<any> {
    const conn = await this.getConnection(dbConfigName)
    const ret = await conn.query(sql, params)
    return ret
  }

  async insert (table, record, ignore: boolean = false) {
    let query = 'INSERT' + (ignore ? ' IGNORE' : '') + ' INTO ' + escapeId(table) + ' SET ?'
    const res = await this.query(query, record)
    return res[0].insertId
  }

  async update (table, index, record) {
    let query = 'UPDATE ' + escapeId(table) + ' SET ? WHERE'
    let values = [record]
    if (typeof index === 'object') {
      for (let i in index) {
        query += ' ' + escapeId(i) + ' = ? AND'
        values.push(index[i])
      }
      query = query.substr(0, query.length - 4)
    } else {
      query += ' `id` = ?'
      values.push(index)
    }
    const res = await this.query(query, values)
    return res
  }

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
