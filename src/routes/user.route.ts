import { Router } from 'express'
import { postUser, getUsers, getUser, putUser, deleteUser, signUp, getGithubData, loginWithGithub, getGitUser } from '../controllers/user.controller'

const router = Router()

router.post('/', postUser)
router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', putUser)
router.delete('/:id', deleteUser)
router.post('/signup', signUp)
router.post('/git_signup/:code', loginWithGithub)
router.get('/git/data', getGithubData)
router.get('/git/exist/:gitId', getGitUser)

export default router
