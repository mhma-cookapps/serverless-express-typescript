// Production Constants
const prodConfig = {
  datastores: {
    default: {
      host: 'xxx.com',
      port: 3306,
      user: 'xxx',
      password: 'xxxx',
      database: 'xxxx',
      timezone: 'utc'
    },
    redis: {
      url: 'redis://xxx.com:6379'
    }
  }
}

module.exports = prodConfig

