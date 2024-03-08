import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia do Zé',
        description: 'A melhor academia do bairro!',
        phone: '11999999999',
        latitude: -16.7018497,
        longitude: -49.2523001,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia do João',
        description: 'A melhor academia do bairro!',
        phone: '11999999999',
        latitude: -16.7054342,
        longitude: -49.1001096,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -16.7018497,
        longitude: -49.2523001,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Academia do Zé',
      }),
    ])
  })
})
