import express from 'express'
import { getDoctors } from '../controllers/doctorController.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', getDoctors)

export default doctorRouter

