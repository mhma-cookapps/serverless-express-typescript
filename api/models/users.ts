import DB from '../utils/db'
import { User } from '../@types/user'

export default {
  getUser: async (db: DB, uid: number): Promise<User> => {
    return db.fetchOne('SELECT * FROM `users` WHERE `uid` = ?', [uid])
  }
}
