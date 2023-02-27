/* eslint-disable semi */
/* eslint-disable eol-last */
import { Prisma, User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

const TOKEN_KEY = process.env.TOKEN_KEY

const createToken = async (user: Prisma.UserCreateInput) => {
  const { email, id, firstName, githubId } = user

  if (user.type === 'githubUser') {
    const token = jwt.sign(
      { userId: id, firstName, githubId },
      TOKEN_KEY as string,
      { expiresIn: '7d' }
    )
    return token
  } else {
    const token = jwt.sign(
      { userId: id, email, firstName },
      TOKEN_KEY as string,
      { expiresIn: '7d' }
    )
    return token
  }
}

export const login = async (password: string, email?: string, githubId?: string, type?: string) => {
  try {
    let user;
    if (type === 'githubUser') {
      user = await prisma.user.findUniqueOrThrow({ where: { githubId } })
    } else {
      user = await prisma.user.findUniqueOrThrow({ where: { email } })
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const newToken = await createToken(user)
      user.token = newToken

      const signUp = await prisma.user.update({
        data: user,
        where: {
          id: user.id
        },
        select: {
          id: true,
          firstName: true,
          email: true,
          token: true
        }
      })
      return signUp
    } else {
      return console.log('Incorrect credentials')
    }
  } catch (error) {
    if (error instanceof Error) {
      return console.log('Error in service' + error.message)
    }
  }
}

export const createUser = async (user: Prisma.UserCreateInput) => {
  try {
    const encryptedPassword = await bcrypt.hash(user.password, 10)

    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        password: encryptedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
        githubId: user.githubId
      }
    });
    const jsonWT = await createToken(newUser)
    newUser.token = jsonWT

    return newUser;
  } catch (error) {
    if (error instanceof Error) {
      return console.log('Error in service' + error.message)
    }
  }
}

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        active: true,
        token: true
      }
    })
    return users
  } catch (error) {
    if (error instanceof Error) {
      return console.log('Error in service' + error.message)
    }
  }
}

export const getOneUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        collections: true
      }
    })
    return user
  } catch (error) {
    if (error instanceof Error) {
      return console.log('Error in service' + error.message)
    }
  }
}

export const getUserByGitId = async (githubId: string) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        githubId
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        collections: true,
        githubId: true
      }
    })
    return user
  } catch (error) {
    if (error instanceof Error) {
      return console.log('Error in service' + error.message)
    }
  }
}

export const updateUser = async (userId: string, user: Prisma.UserCreateInput) => {
  try {
    const userUpdated = await prisma.user.update({
      data: user,
      where: {
        id: userId
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    })

    return userUpdated
  } catch (error) {
    if (error instanceof Error) {
      return console.log('Error in service' + error.message)
    }
  }
}

export const deleteUserById = async (userId: string): Promise<User> => {
  const data = await prisma.user.delete({
    where: {
      id: userId
    }
  })
  return data;
}