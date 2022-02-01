const request = require('supertest')
const app = require('../src')

describe('User', () => {
  it('Create user', async () => {
    const res = await request(app)
      .post('/api/users/')
      .field('name', 'test')
      .field('password', '12345')
      .field('email', 'test@gmail.com')
      .field('bio', 'I am a developer')
      .attach('avatar', null)
      .attach('background', null)

    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body).toHaveProperty('name')
    expect(res.body).toHaveProperty('password')
    expect(res.body).toHaveProperty('email')
    expect(res.body).toHaveProperty('bio')
    expect(res.body).toHaveProperty('avatar')
    expect(res.body).toHaveProperty('background')
    expect(res.body).toHaveProperty('followers')
    expect(res.body).toHaveProperty('following')
    expect(res.body).toHaveProperty('tweets')
  })

  it('Login existent user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@gmail.com',
        password: '12345'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('access')
    expect(res.body).toHaveProperty('refresh')
  })

  it('Login bad password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@gmail.com',
        password: '123456'
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('error')
  })

  it('Login unexistent user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'dsakdjkq2@gmail.com',
        password: '12345'
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error')
  })

  it('Refresh tokens', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@gmail.com',
        password: '12345'
      })

    const refresh = res.body.refresh
    const res2 = await request(app)
      .post('/api/users/refresh')
      .send({
        refresh
      })
    expect(res2.statusCode).toEqual(200)
    expect(res2.body).toHaveProperty('access')
    expect(res2.body).toHaveProperty('refresh')
  })

  it('Delete user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@gmail.com',
        password: '12345'
      })

    const access = res.body.access
    const res2 = await request(app)
      .delete('/api/users/')
      .set('Authorization', `Bearer ${access}`)

    expect(res2.statusCode).toEqual(204)
  })

  it('Follow user', async () => {
    const res = await request(app)
      .post('/api/users/')
      .field('name', 'test')
      .field('password', '12345')
      .field('email', 'test@gmail.com')
      .field('bio', 'I am a developer')
      .attach('avatar', null)
      .attach('background', null)

    const idUserFollow = res.body._id
    const res2 = await request(app)
      .post('/api/users/')
      .field('name', 'test2')
      .field('password', '12345')
      .field('email', 'test2@gmail.com')
      .field('bio', 'I am a developer')
      .attach('avatar', null)
      .attach('background', null)

    const idUserFollowed = res2.body._id

    const res3 = await request(app)
      .post('/api/users/follow')
      .send({
        idUserFollow,
        idUserFollowed
      })

    expect(res3.statusCode).toEqual(200)
  })
})
