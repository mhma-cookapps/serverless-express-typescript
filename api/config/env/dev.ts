import config from '../config'

// Development Constants
const devConfig = {
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

export default {
  ...config,
  ...devConfig
}
