import { Prisma } from '@prisma/client'
import { NextFunction, Response } from 'express'
import { AuthRequest } from '../types/express-types'
import {
  createNewWord,
  deleteWordById,
  getAllWords,
  getOneWord,
  haveAuthorizationOnWord,
  updateWordById
} from '../services/word.service'
import { AuthorizationHttpError } from '../types/error'

export const getWordsByCollection = async (req : AuthRequest, res: Response, next: NextFunction) => {
  const collectionId = req.params.id

  const words = await getAllWords(collectionId)

  res.status(200).send(words)
}

export const getWordById = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const wordId = req.params.collectionId
  const word = await getOneWord(wordId)

  if (userId !== word.collection.userId) throw new AuthorizationHttpError()

  res.status(200).send(word)
}

export const postNewWord = async (req: AuthRequest, res: Response) => {
  const newWord: Prisma.WordCreateInput = req.body
  const createdWord = await createNewWord(newWord)

  res.status(201).send(createdWord)
}

export const putWord = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const wordId: string = req.params.id

  if (!haveAuthorizationOnWord(wordId, userId as string)) throw new AuthorizationHttpError()

  const updateWord: Prisma.WordUpdateInput = req.body
  const updatedWord = await updateWordById(updateWord, wordId)

  res.status(200).send(updatedWord)
}

export const deleteWord = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const wordId: string = req.params.id

  if (!haveAuthorizationOnWord(wordId, userId as string)) throw new AuthorizationHttpError()

  const deletedWord = await deleteWordById(wordId)

  res.status(200).send(deletedWord)
}
