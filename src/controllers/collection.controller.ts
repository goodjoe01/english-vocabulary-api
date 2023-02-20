import { Prisma } from '@prisma/client'
import { NextFunction, Response } from 'express'
import { AuthRequest } from '../types/express-types'
import {
  createNewCollection,
  deleteCollectionById,
  getAllCollections,
  getOneCollection,
  haveAuthorizationOnCollection,
  updateCollectionById
} from '../services/collection.service'
import { AuthorizationHttpError } from '../types/error'

export const getcollections = async (req : AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.userId

  const collections = await getAllCollections(userId as string)

  res.status(200).send(collections)
}

export const getcollection = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const collectionId = req.params.id
  const collection = await getOneCollection(collectionId)

  if (userId !== collection.userId) throw new AuthorizationHttpError()

  res.status(200).send(collection)
}

export const postNewcollection = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  console.log('service id: ', req.userId)
  const newcollection: Prisma.CollectionCreateInput = req.body
  const createdcollection = await createNewCollection(newcollection, userId as string)

  res.status(201).send(createdcollection)
}

export const putcollection = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const collectionId: string = req.params.id

  if (!haveAuthorizationOnCollection(collectionId, userId as string)) throw new AuthorizationHttpError()

  const updatecollection: Prisma.CollectionUpdateInput = req.body
  const updatedcollection = await updateCollectionById(updatecollection, collectionId)

  res.status(200).send(updatedcollection)
}

export const deletecollection = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const collectionId: string = req.params.id

  if (!haveAuthorizationOnCollection(collectionId, userId as string)) throw new AuthorizationHttpError()

  const deletedcollection = await deleteCollectionById(collectionId)

  res.status(200).send(deletedcollection)
}
