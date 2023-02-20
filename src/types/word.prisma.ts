import { Prisma } from '@prisma/client'

export type WordWithCollection = Prisma.WordGetPayload<{include: { collection: true }}>
