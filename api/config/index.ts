const envConfig = require(`./env/${process.env.STAGE}`)

const commonConfig = {
  jwtSecret: 'SECRET@@SALT',
  jwtUnlessPath: [
    '/env', '/favicon.ico', '/api/v1/auth/login', '/api/v1/version', '/api/v1/jobs/clearSpec'
  ]
}

export default { ...envConfig, ...commonConfig }
