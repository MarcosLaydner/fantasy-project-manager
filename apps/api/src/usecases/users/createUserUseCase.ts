import { Prisma, type PrismaClient } from '@prisma/client'
import { ApplicationError } from '../../errors/ApplicationError'
import { hashPassword } from '../../lib/password'
import { createUser } from '../../repositories/userRepository'
import type { User } from '../../../../packages/shared/user'

export type CreateUserUseCaseInput = {
  username: string
  email: string
  password: string
}

export type CreateUserUseCaseResult = User | ApplicationError

export async function createUserUseCase (
  prisma: PrismaClient,
  input: CreateUserUseCaseInput
): Promise<CreateUserUseCaseResult> {
  try {
    const user = await createUser(prisma, {
        username: input.username,
        email: input.email,
        password: await hashPassword(input.password)
    })

    return user
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return new ApplicationError('A user with this username or email already exists', 409)
    }

    throw error
  }
}
