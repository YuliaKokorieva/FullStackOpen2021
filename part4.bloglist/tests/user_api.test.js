const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')



describe('creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
    })

    test('succeeds when requirements are met', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'Maria',
          name: 'Maria Helena',
          password: 'password'
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('fails when username is already taken', async ()=> {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('`username` to be unique')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    
    })

    test('fails when username is too short', async ()=> {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'A',
          name: 'Anna-Maria',
          password: 'password',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('is shorter than the minimum allowed length')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails when username is missing', async ()=> {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          name: 'Anna-Maria',
          password: 'password',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('is required')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails when password is too short', async ()=> {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'Anna',
          name: 'Anna-Maria',
          password: 'p',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('password must be at least 3 characters long')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    
    })
})

afterAll(() => {
    mongoose.connection.close()
})