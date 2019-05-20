import DBManager from '../utils/db'

interface User {
  uid: number
  name: string
}

export default {
  getUser: async (db: DBManager, uid: number) => {
    const user: User = await db.fetchOne('SELECT * FROM `users` WHERE `uid` = ?', [uid])
    return user
  }
}
