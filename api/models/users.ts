import DB from '../utils/db';

interface User {
  uid: number
  name: string
}

export default {
  getUser: async (db: DB, uid: number) => {
    const user: User = await db.fetchOne('SELECT * FROM `users` WHERE `uid` = ?', [uid])
    return user
  }
}
