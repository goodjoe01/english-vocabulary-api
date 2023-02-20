import { Router } from 'express'
import { postUser, getUsers, getUser, putUser, deleteUser, signUp } from '../controllers/user.controller'

const router = Router()

router.post('/', postUser)
router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', putUser)
router.delete('/:id', deleteUser)
router.post('/signup', signUp)

export default router
