import { Word, Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import { WordWithCollection } from '../types/word.prisma'

export const getAllWords = async (collectionId: string): Promise<Array<Word>> => {
  const data = await prisma.word.findMany({
    where: {
      collectionId
    }
  })

  return data
}

export const getOneWord = async (wordId: string): Promise<WordWithCollection> => {
  const data = await prisma.word.findUniqueOrThrow({
    where: {
      id: wordId
    },
    include: {
      collection: true
    }
  })

  return data
}

export const createNewWord = async (newWord: Prisma.WordCreateInput): Promise<Word> => {
  const data = await prisma.word.create({
    data: {
      ...newWord,
      collection: {
        connect: { id: newWord.collection.connect?.id }
      }
    }
  })

  return data
}

export const updateWordById = async (updatedWord: Prisma.WordUpdateInput, wordId: string): Promise<Word> => {
  const data = await prisma.word.update({
    data: updatedWord,
    where: {
      id: wordId
    }
  })

  return data
}

export const deleteWordById = async (wordId: string): Promise<Word> => {
  const data = await prisma.word.delete({
    where: {
      id: wordId
    }
  })

  return data
}

export const haveAuthorizationOnWord = async (wordId:string, userId: string): Promise<boolean> => {
  const dbWord = await prisma.word.findUniqueOrThrow({
    where: {
      id: wordId
    },
    select: {
      collection: {
        select: {
          userId: true
        }
      }
    }
  })
  if (userId !== dbWord.collection.userId) return false
  return true
}
