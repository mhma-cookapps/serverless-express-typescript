import { createConnection, escapeId } from 'mysql2/promise'
import config from '../config'

class DBManager {
  private conn = null
  private dataStoreKey: string = null
  constructor (datastoreKey: string) {
    this.dataStoreKey = config.datastores[datastoreKey]
  }

  async getConnection () {
    if (!this.dataStoreKey) return null
    if (this.conn) return this.conn
    this.conn = await createConnection(Object.assign({ connectTimeout: 20000 }, this.dataStoreKey))
    return this.conn
  }

  /**
   * Memory Destructor
   */
  async release () {
    if (this.conn) {
      await this.conn.end()
      this.conn = null
    }
  }

  /**
   * Exrtract Helpers
   */
  async query (sql, params: any[] = []): Promise <any> {
    try {
      const conn = await this.getConnection()
      const ret = await conn.query(sql, params)
      return ret
    } catch (error) {
      console.error(error)
    }
    return false
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

  async fetchRows (sql, params: any[] = []): Promise <any[]> {
    const queryResult = await this.query(sql, params)
    if (!queryResult[0 ]) return null
    const data: any[] = queryResult[0]

    const ret = data.map(row => {
      return Object.entries(row).reduce((r, [k, v]) => {
        r[k] = v
        return r
      }, {})
    })

    return ret
  }

  async fetchOne (sql, params: any[] = []): Promise <any> {
    const ret = await this.fetchRows(sql, params)
    return (ret) ? ret.shift() : null
  }
}

export default DBManager
