import { type FastifyPluginAsync } from 'fastify'
import { ApplicationError } from '../errors/ApplicationError'
import {
  createUserBodySchema,
  createUserResponseSchema,
  type CreateUserBody
} from '../serializers/user'
import type {} from '../types/fastify'
import { createUserUseCase } from '../usecases/users/createUserUseCase'

const users: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<{ Body: CreateUserBody }>('/users', {
    schema: {
      body: createUserBodySchema,
      response: createUserResponseSchema
    }
  }, async (request, reply) => {
    const result = await createUserUseCase(fastify.prisma, request.body)

    if (result instanceof ApplicationError) {
      return await reply.code(result.code).send(result)
    }

    return await reply.code(201).send(result)
  })
}

export default users
