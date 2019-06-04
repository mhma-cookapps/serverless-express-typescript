import express from 'express'
import { wrapAsync } from '../../utils/function'
import { Request } from '../../@types/request'

const router = express.Router()

router.post('/login', wrapAsync(async (req: Request, res, next) => {
  res.send({ data: 'OK' })
}))

export default router
