import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Hugo Marcelo',
    email: 'hugomarcelo91@gmail.com',
  },
})
