// Development Constants
const localConfig = {
  datastores: {
    default: {
      host: 'xxx.com',
      port: 3306,
      user: 'xxx',
      password: 'xxxx',
      database: 'xxxx',
      timezone: 'utc',
      dateStrings: true
    },
    redis: {
      url: 'redis://xxx.com:6379'
    }
  }
}

module.exports = localConfig
