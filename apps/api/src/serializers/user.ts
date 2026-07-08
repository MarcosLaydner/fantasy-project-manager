export type CreateUserBody = {
  username: string
  email: string
  password: string
}

export const createUserBodySchema = {
  type: 'object',
  required: ['username', 'email', 'password'],
  additionalProperties: false,
  properties: {
    username: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 }
  }
} as const

export const createUserResponseSchema = {
  201: {
    type: 'object',
    required: ['id', 'username', 'email'],
    properties: {
      id: { type: 'string' },
      username: { type: 'string' },
      email: { type: 'string' }
    }
  },
  409: {
    type: 'object',
    required: ['code', 'message'],
    properties: {
      code: { type: 'number' },
      message: { type: 'string' }
    }
  }
} as const
