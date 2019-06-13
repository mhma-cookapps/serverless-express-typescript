const envConfig = require(`./env/${process.env.STAGE}`)

const commonConfig = {
  jwtSecret: 'SECRET@@SALT',
  jwtUnlessPath: [
    '/env', '/favicon.ico'
  ]
}

export default { ...envConfig, ...commonConfig }
