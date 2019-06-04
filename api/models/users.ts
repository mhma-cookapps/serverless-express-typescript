import DB from '../utils/db'
import { User } from '../@types/user'

export default {
  getUser: async (db: DB, uid: number) => {
    const user: User = await db.fetchOne('SELECT * FROM `users` WHERE `uid` = ?', [uid])
    return user
  }
}
