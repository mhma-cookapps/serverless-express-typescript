import localConfig from './env/local'
import devConfig from './env/dev'
import prodConfig from './env/prod'

const envConfigList = {
  local: localConfig,
  dev: devConfig,
  prod: prodConfig
}
const envConfig = envConfigList[process.env.STAGE]
const commonConfig = {
  jwtSecret: 'cookapps!@#$',
  jwtUnlessPath: [
    '/env', '/favicon.ico', '/api/v1/auth/login', '/api/v1/version', '/api/v1/jobs/clearSpec'
  ]
}

export default { ...envConfig, ...commonConfig }
