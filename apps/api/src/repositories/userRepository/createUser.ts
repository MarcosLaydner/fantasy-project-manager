import type { PrismaClient } from '@prisma/client'
import type { User } from '../../../../packages/shared/user'

export type CreateUserData = {
  username: string
  email: string
  password: string
}

export async function createUser (
  prisma: PrismaClient,
  data: CreateUserData
): Promise<User> {
  return await prisma.user.create({
    data,
    select: {
      id: true,
      username: true,
      email: true
    }
  })
}
