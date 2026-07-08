import { test } from 'node:test'
import * as assert from 'node:assert'
import Fastify from 'fastify'
import sensible from '@fastify/sensible'
import { Prisma } from '@prisma/client'
import users from '../../src/routes/users'

test('POST /users creates a user with a hashed password', async (t) => {
  const app = Fastify()
  let savedPassword = ''

  app.decorate('prisma', {
    user: {
      create: async ({ data, select }: any) => {
        savedPassword = data.password

        assert.deepStrictEqual(select, {
          id: true,
          username: true,
          email: true
        })

        return {
          id: 'user_1',
          username: data.username,
          email: data.email
        }
      }
    }
  } as any)

  await app.register(sensible)
  await app.register(users)

  t.after(() => void app.close())

  const response = await app.inject({
    method: 'POST',
    url: '/users',
    payload: {
      username: 'markito',
      email: 'markito@example.com',
      password: 'password123'
    }
  })

  assert.equal(response.statusCode, 201)
  assert.deepStrictEqual(JSON.parse(response.payload), {
    id: 'user_1',
    username: 'markito',
    email: 'markito@example.com'
  })
  assert.notEqual(savedPassword, 'password123')
  assert.match(savedPassword, /^scrypt\$[a-f0-9]+\$[a-f0-9]+$/)
})

test('POST /users rejects invalid payloads', async (t) => {
  const app = Fastify()

  app.decorate('prisma', {
    user: {
      create: async () => {
        throw new Error('should not be called')
      }
    }
  } as any)

  await app.register(sensible)
  await app.register(users)

  t.after(() => void app.close())

  const response = await app.inject({
    method: 'POST',
    url: '/users',
    payload: {
      username: 'markito',
      email: 'not-an-email',
      password: 'short'
    }
  })

  assert.equal(response.statusCode, 400)
})

test('POST /users returns conflict for duplicate username or email', async (t) => {
  const app = Fastify()

  app.decorate('prisma', {
    user: {
      create: async () => {
        throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: 'test'
        })
      }
    }
  } as any)

  await app.register(sensible)
  await app.register(users)

  t.after(() => void app.close())

  const response = await app.inject({
    method: 'POST',
    url: '/users',
    payload: {
      username: 'markito',
      email: 'markito@example.com',
      password: 'password123'
    }
  })

  assert.equal(response.statusCode, 409)
  assert.deepStrictEqual(JSON.parse(response.payload), {
    code: 409,
    message: 'A user with this username or email already exists'
  })
})
