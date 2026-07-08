import fp from 'fastify-plugin'
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

if (connectionString == null) {
  throw new Error('DATABASE_URL must be set before starting the API')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export default fp(async (fastify) => {
  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
})
