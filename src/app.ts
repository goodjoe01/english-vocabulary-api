import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import userRouter from './routes/user.route'
import { ErrorHandler } from './middleware/error-handler'
import collectionRouter from './routes/collection.route'

const app = express()

/* const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
} */

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/users', userRouter)
app.use('/api/collections', collectionRouter)

app.use(ErrorHandler)

export default app
