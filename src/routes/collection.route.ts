import { Router } from 'express'
import { deletecollection, getcollection, getcollections, getLastNCollections, postNewcollection, putcollection } from '../controllers/collection.controller'
import { AuthHandler } from '../middleware/auth'
import { HttpError } from '../types/error'

const collectionRouter = Router()

collectionRouter.post('/', AuthHandler, postNewcollection)
collectionRouter.get('/', AuthHandler, getcollections)
collectionRouter.get('/limit/:limit', AuthHandler, getLastNCollections)
collectionRouter.get('/:id', AuthHandler, getcollection)
collectionRouter.patch('/:id', AuthHandler, putcollection)
collectionRouter.put('/:id', AuthHandler, putcollection)
collectionRouter.delete('/:id', AuthHandler, deletecollection)
collectionRouter.all('/', (req, res, next) => {
  throw new HttpError('Method not supported.', 405)
}
)

export default collectionRouter
