const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const User = require('../models/user')



describe('testing GET, POST and DELETE methods for blogs', ()=> {
    beforeEach(async () => {
        await Blog.deleteMany({})
        
        const blogObjects = helper.initialBlogs
          .map(b => new Blog(b))
          const promiseArray = blogObjects.map(b => b.save())
        await Promise.all(promiseArray)
    })

    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })
    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
      
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('unique identifier is "id", not "_id"', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
    
    test('a valid blog can be added', async () => {
        
        const newBlog = {
            title: "Test blog",
            author: "Test blog author",
            url: "Test blog URL",
            likes: 2,
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const blogsFinal = await helper.blogsInDb()
        expect(blogsFinal).toHaveLength(helper.initialBlogs.length + 1)
    
        const contents = blogsFinal.map(b=>b.title)
        expect(contents).toContain(
            'Test blog'
        )
    })
    
    test('no likes = 0 likes', async () => {
        const newBlog = {
            title: "Test blog 2",
            author: "Test blog author 2",
            url: "Test blog URL 2"
        }
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        expect(response.body.likes).toEqual(0)
    })
    
    test('no title and URL = 400 Bad Request', async () => {
        const newBlog = {
           author: "Test blog author 3",
           likes: 4
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
        const blogsFinal = await helper.blogsInDb()
    
        expect(blogsFinal).toHaveLength(helper.initialBlogs.length)
    })
    
    test('updating a blog post', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
    
        const update = {
            title:"Updated title",
            author :"Updated author",
            url:"Updated URL", 
            likes: 10
        }
    
        await api   
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(update)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
            const blogsFinal = await helper.blogsInDb()
            expect(blogsFinal).toHaveLength(helper.initialBlogs.length)
    
            const contents = blogsFinal.map(b=>b.title)
            expect(contents).toContain(
                'Updated title'
        )
    
    })
    
    test('deletion of a blog post', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[5]
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
            const blogsFinal = await helper.blogsInDb()
    
            expect(blogsFinal).toHaveLength(
                helper.initialBlogs.length - 1
            )
    
            const contents = blogsFinal.map(b=>b.title)
    
            expect(contents).not.toContain(blogToDelete.title)
    })

})

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