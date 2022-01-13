const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const User = require('../models/user')



describe('testing GET, POST and PUT methods for blogs', ()=> {
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
    
    test('a valid blog can be added when user authorized', async () => {

        const loginUser = {
            "username": "root",
            "password": "sekret"
        }
        
        const loginResponse = await api 
            .post('/api/login')
            .send(loginUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        let token = loginResponse.body.token

        const newBlog = {
            title: "Test blog",
            author: "Test blog author",
            url: "Test blog URL",
            likes: 2,
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({Authorization : "bearer " + token})
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const blogsFinal = await helper.blogsInDb()
        expect(blogsFinal).toHaveLength(helper.initialBlogs.length + 1)
    
        const contents = blogsFinal.map(b=>b.title)
        expect(contents).toContain(
            'Test blog'
        )
    })

    test('blog post cannot be added when token not provided', async () => {
        const newBlog = {
            title: "No token",
            author: "Test blog author",
            url: "Test blog URL",
            likes: 2,
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    })
    
    test('no likes = 0 likes, authorized', async () => {

        const loginUser = {
            "username": "root",
            "password": "sekret"
        }
        
        const loginResponse = await api 
            .post('/api/login')
            .send(loginUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        let token = loginResponse.body.token


        const newBlog = {
            title: "Test blog 2",
            author: "Test blog author 2",
            url: "Test blog URL 2"
        }
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set({Authorization : "bearer " + token})
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        expect(response.body.likes).toEqual(0)
    })
    
    test('no title and URL = 400 Bad Request, authorized', async () => {
        
        const loginUser = {
            "username": "root",
            "password": "sekret"
        }
        
        const loginResponse = await api 
            .post('/api/login')
            .send(loginUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        let token = loginResponse.body.token
        
        const newBlog = {
           author: "Test blog author 3",
           likes: 4
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({Authorization : "bearer " + token})
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
})
describe('deletion of a blog post', ()=> {

    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()

        await Blog.deleteMany({})

        const blogObjects = helper.initialBlogs
            .map(b => new Blog(b))
        const promiseArray = blogObjects.map(b => b.save())
        await Promise.all(promiseArray)
 
    })

    test('succeeds when authorized user deletes their own post', async () => {

        const loginUser = {
            "username": "root",
            "password": "sekret"
        }
        
        const loginResponse = await api 
            .post('/api/login')
            .send(loginUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        let token = loginResponse.body.token


        const newBlog = {
            title: "Test blog to delete",
            author: "Test blog author",
            url: "Test blog URL",
            likes: 2,
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({Authorization : "bearer " + token})
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[blogsAtStart.length-1]
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({Authorization : "bearer " + token})
            .expect(204)
        
        const blogsFinal = await helper.blogsInDb()
    
        expect(blogsFinal).toHaveLength(blogsAtStart.length-1)
    
        const contents = blogsFinal.map(b=>b.title)
    
        expect(contents).not.toContain(blogToDelete.title)
    })

   
})

afterAll(() => {
    mongoose.connection.close()
})