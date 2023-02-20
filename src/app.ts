import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import userRouter from './routes/user.route'
import { ErrorHandler } from './middleware/error-handler'
import collectionRouter from './routes/collection.route'
import wordRouter from './routes/word.route'

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/users', userRouter)
app.use('/api/collections', collectionRouter)
app.use('/api/words', wordRouter)

app.use(ErrorHandler)

export default app
