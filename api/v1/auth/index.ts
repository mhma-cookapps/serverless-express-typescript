import express from 'express'
import { wrapAsync } from '../../utils/function'

const router = express.Router()

router.post('/login', wrapAsync(async (req: any, res, next) => {
  res.send({ data: 'OK' })
}))

export default router
