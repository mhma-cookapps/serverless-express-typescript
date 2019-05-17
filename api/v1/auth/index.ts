import express from 'express'
import { errInternal } from '../../utils/error'

const router = express.Router()

router.post('/login', async (req: any, res, next) => {
  try {
    res.send({ data: 'OK' })
  } catch (err) {
    return next(errInternal(err.message))
  }
})

export default router
