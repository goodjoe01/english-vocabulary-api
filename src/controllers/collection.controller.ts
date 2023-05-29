import { Prisma } from '@prisma/client'
import { NextFunction, Response } from 'express'
import { AuthRequest } from '../types/express-types'
import {
  createNewCollection,
  deleteCollectionById,
  getAllCollections,
  findCollectionByName,
  getOneCollection,
  haveAuthorizationOnCollection,
  updateCollectionById,
  getLastCollections
} from '../services/collection.service'
import { AuthorizationHttpError } from '../types/error'

export const getcollections = async (req : AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.userId
  const collectionName = req.params.name

  const collections = await getAllCollections(userId as string, collectionName)

  res.status(200).send(collections)
}

export const findcollectionsByName = async (req : AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.userId
  const collectionName = req.params.name
  console.log('colName: ', collectionName)
  const collections = await findCollectionByName(collectionName ,userId as string)

  res.status(200).send(collections)
}

export const getLastNCollections = async (req : AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.userId
  const limit = Number(req.params.limit)

  const collections = await getLastCollections(userId as string, limit)

  res.status(200).send(collections)
}

export const getcollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.userId
  const collectionId = req.params.id
  const collection = await getOneCollection(collectionId)

  if (userId !== collection.userId) throw new AuthorizationHttpError()

  res.status(200).send(collection)
}

export const postNewcollection = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const newcollection: Prisma.CollectionCreateInput = req.body
  const createdcollection = await createNewCollection(newcollection, userId as string)

  res.status(201).send(createdcollection)
}

export const putcollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId
    const collectionId: string = req.params.id
    console.log('colid: ', collectionId)
    const auth = await haveAuthorizationOnCollection(collectionId, userId as string)
    if (!auth) throw new AuthorizationHttpError()

    const updatecollection: Prisma.CollectionUpdateInput = req.body
    const updatedcollection = await updateCollectionById(updatecollection, collectionId)
    res.status(200).send(updatedcollection)
  } catch (error) {
    next(error)
  }
}

export const deletecollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId
    const collectionId: string = req.params.id
    const auth = await haveAuthorizationOnCollection(collectionId, userId as string)
    if (!auth) throw new AuthorizationHttpError()

    const deletedcollection = await deleteCollectionById(collectionId)

    res.status(200).send(deletedcollection)
  } catch (error) {
    next(error)
  }
}
