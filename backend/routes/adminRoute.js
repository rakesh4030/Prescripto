import express from 'express'
import { addDoctor, seedDoctor } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',upload.single('image'),addDoctor)
// dev helper to seed a doctor with JSON body
adminRouter.post('/seed', seedDoctor)

export default adminRouter