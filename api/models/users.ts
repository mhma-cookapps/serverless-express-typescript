import DB from '../utils/db'
import { User } from '../@types/user'
import { BaseModel } from './base'

export class UserModel extends BaseModel {
  constructor (db: DB) {
    super()
    this.db = db
    this.tableName = 'users'
  }

  get (uid: number): Promise<User> {
    return this.db.fetchOne(`SELECT * FROM \`${this.tableName}\` WHERE \`uid\` = ?`, [uid])
  }
}
