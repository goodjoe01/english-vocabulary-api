import { Prisma } from '@prisma/client'
import { createUser, getAllUsers, getOneUser, updateUser, deleteUserById, login, getUserByGitId } from '../services/user.service'
import { Request, Response } from 'express'

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, githubId, type } = req.body
    const loggedUser = await login(password, email, githubId, type)
    res.status(200).json(loggedUser)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

export const loginWithGithub = async (req: Request, res: Response) => {
  try {
    const code = req.params.code
    const params = '?client_id=' + process.env.GIT_ID + '&client_secret=' + process.env.CLIENT_SECRET + '&code=' + code

    fetch('https://github.com/login/oauth/access_token' + params, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line quote-props
        'Accept': 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      console.log(data)
      res.json(data)
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

export const getGithubData = async (req: Request, res: Response) => {
  try {
    const headers = new Headers()
    const token = req.get('Authorization')
    console.log('This is the token: ', token)
    if (token) {
      headers.set('Authorization', token)
      headers.set('X-GitHub-Api-Version', '2022-11-28')
    }
    fetch('https://api.github.com/user', {
      method: 'GET',
      headers
    }).then(res => {
      return res.json()
    }).then(data => {
      console.log(data)
      res.json(data)
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

export const postUser = async (req: Request, res: Response) => {
  try {
    const userBody: Prisma.UserCreateInput = req.body
    const user = await createUser(userBody)
    return res.status(200).json(user)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    }
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const user = await getOneUser(id)
    res.status(200).json(user)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    }
  }
}

export const getGitUser = async (req: Request, res: Response) => {
  try {
    const gitId = req.params.gitId
    const user = await getUserByGitId(gitId)
    res.status(200).json(user)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    }
  }
}

export const putUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const userBody: Prisma.UserCreateInput = req.body
    const user = await updateUser(id, userBody)
    res.status(200).json(user)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    }
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id

  const deletedUser = await deleteUserById(userId)

  res.status(200).send(deletedUser)
}
