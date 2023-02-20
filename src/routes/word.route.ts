import { Router } from 'express'
import { deleteWord, getWordsByCollection, getWordById, postNewWord, putWord } from '../controllers/word.controller'
import { AuthHandler } from '../middleware/auth'
import { HttpError } from '../types/error'

const wordRouter = Router()

wordRouter.post('/', AuthHandler, postNewWord)
wordRouter.get('/', AuthHandler, getWordsByCollection)
wordRouter.get('/:id', AuthHandler, getWordById)
wordRouter.put('/:id', AuthHandler, putWord)
wordRouter.delete('/:id', AuthHandler, deleteWord)
wordRouter.all('/', (req, res, next) => {
  throw new HttpError('Method not supported.', 405)
}
)

export default wordRouter
