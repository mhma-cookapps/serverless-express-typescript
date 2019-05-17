import awsServerlessExpress from 'aws-serverless-express'
import express from 'express'
import interceptor from 'express-interceptor'
import { ApiError } from './utils/error'
import DBManager from './utils/db'
import v1 from './v1'
import RedisManager from './utils/redis'

const app = express()
app.use(express.json())
// Inject Resources
app.use((req: any, res, next) => {
  req.db = new DBManager()
  req.redis = new RedisManager()
  next()
})
// Release Resources
// intercept res.send
const finalInterceptor = interceptor((req, res) => {
  return {
    isInterceptable: () => {
      return true
    },
    intercept: async (body, send) => {
      let finalBody = body
      try {
        if (req.db) await req.db.release()
        if (req.redis) req.redis.release()
      } catch (error) {
        console.error(error)
      }
      send(finalBody)
    }
  }
})
app.use(finalInterceptor)
app.use('/api/v1', v1)
app.get('/env', (req, res) => res.json({ result: `Target: ${process.env.STAGE}` }))

// Error Handling
app.use((err, req, res, next) => {
  console.error(err)
  const error = {
    code: 500,
    name: 'internal-server-error',
    message: err.message
  }
  if (err instanceof ApiError) {
    error.code = err.code
    error.name = err.name
  }
  res.status(error.code).send({ error })
})

const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)
