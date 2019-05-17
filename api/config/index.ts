import localConfig from './env/local'
import devConfig from './env/dev'
import prodConfig from './env/prod'

const config = {
  local: localConfig,
  dev: devConfig,
  prod: prodConfig
}

export default config[process.env.NODE_ENV]
