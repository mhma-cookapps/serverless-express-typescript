import { createConnection, escapeId } from 'mysql2/promise'
import config from '../config'

class DB {
  // Database Connection
  private conn = null
  // Database Config
  private dataStoreConfig: object = null
  // Debug Query
  private debug = true

  constructor (datastoreKey: string) {
    this.dataStoreConfig = config.datastores[datastoreKey]
  }

  async getConnection () {
    if (!this.dataStoreConfig) return null
    if (this.conn) return this.conn
    this.conn = await createConnection(Object.assign({ connectTimeout: 20000 }, this.dataStoreConfig))
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
   * Helpers
   */
  async beginTransaction (): Promise <any> {
    const conn = await this.getConnection()
    await conn.beginTransaction()
  }

  async commit (): Promise <any> {
    const conn = await this.getConnection()
    await conn.commit()
  }

  async rollback (): Promise <any> {
    const conn = await this.getConnection()
    await conn.rollback()
  }

  async query (sql, params: any[] = []): Promise <any> {
    if (/^update/i.test(sql) && !(/where/i.test(sql))) throw new Error('Invalid Update Query')
    const conn = await this.getConnection()
    const query = conn.format(sql, params)
    const ret = await conn.query(query)
    if (process.env.STAGE === 'local' && this.debug) {
      console.log(query)
    }
    return ret
  }

  async insert (table, record, ignore: boolean = false): Promise<number> {
    const query = 'INSERT' + (ignore ? ' IGNORE' : '') + ' INTO ' + escapeId(table) + ' SET ?'
    const res = await this.query(query, record)
    return res[0].insertId
  }

  async insertUpdate (table, recordInsert, recordUpdate): Promise<any> {
    const query = 'INSERT INTO ' + escapeId(table) + ' SET ? ON DUPLICATE KEY UPDATE ?'
    const values = [recordInsert, recordUpdate]
    const res = await this.query(query, values)
    return res
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

  async fetchRows (sql: string, params: any[] = []): Promise <any[]> {
    const queryResult = await this.query(sql, params)
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

  async fetchOne (sql: string, params: any[] = []): Promise <any> {
    const ret = await this.fetchRows(sql, params)
    return (ret) ? ret.shift() : null
  }

  affectedRows (queryResult: any[]) {
    if (!queryResult || queryResult.length <= 0) return 0
    return queryResult[0].affectedRows || 0
  }
}

export default DB
