import * as dotenv from 'dotenv'
import app from './app'
import prisma from './lib/prisma'
dotenv.config()

const PORT = process.env.PORT || 8000

async function main () {
  try {
    await prisma.$connect()
    app.listen(PORT, () => {
    })
  } catch (error) {
    if (error instanceof Error) { console.error(error.message) }
  }
}

main()
