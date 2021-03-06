const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1,})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {username: 1, name: 1,})

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = request.user

  if (!user.id) {    
    return response.status(401).json({ 
      error: 'token missing or invalid' 
    })  
  }  

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()

  const userToUpdate = await User.findById(user.id)

  userToUpdate.blogs = userToUpdate.blogs.concat(savedBlog._id)
  await userToUpdate.save()

  response.json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
  
  blogToDelete = await Blog.findById(request.params.id)
  const user = request.user

  if (!user.id) {    
    return response.status(401).json({ 
      error: 'token missing or invalid' 
    })  
  }  

   if ( blogToDelete.user.toString() === user.id) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
   } else {
    return response.status(401).json({ 
      error: "You don't have permission to delete this blog"
    })  
   }

})

blogsRouter.put('/:id', async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
  response.json(updatedBlog)
})

module.exports = blogsRouter