import { Collection, Prisma } from '@prisma/client'

import prisma from '../lib/prisma'

export const getAllCollections = async (userId: string): Promise<Array<Collection>> => {
  const data = await prisma.collection.findMany({
    where: {
      userId
    },
    orderBy: [
      {
        createdAt: 'desc'
      }
    ]
  })

  return data
}

export const getLastCollections = async (userId: string, n: number): Promise<Array<Collection>> => {
  const data = await prisma.collection.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: n
  })

  return data
}

export const getOneCollection = async (CollectionId: string): Promise<Collection> => {
  const data = await prisma.collection.findUniqueOrThrow({
    where: {
      id: CollectionId
    }
  })

  return data
}

export const createNewCollection = async (newCollection: Prisma.CollectionCreateInput, userId: string): Promise<Collection> => {
  const data = await prisma.collection.create({
    data: {
      ...newCollection,
      user: {
        connect: { id: userId }
      }
    }
  })

  return data
}

export const updateCollectionById = async (updatedCollection: Prisma.CollectionUpdateInput, CollectionId: string): Promise<Collection> => {
  const data = await prisma.collection.update({
    data: updatedCollection,
    where: {
      id: CollectionId
    }
  })

  return data
}

export const deleteCollectionById = async (CollectionId: string): Promise<Collection> => {
  const data = await prisma.collection.delete({
    where: {
      id: CollectionId
    }
  })

  console.log('data:', data)
  return data
}

export const haveAuthorizationOnCollection = async (CollectionId:string, userId: string): Promise<boolean> => {
  const dbCollection = await prisma.collection.findUniqueOrThrow({
    where: {
      id: CollectionId
    },
    select: {
      userId: true
    }
  })
  console.log({ dbCollection, userId })
  if (userId !== dbCollection.userId) return false
  return true
}
