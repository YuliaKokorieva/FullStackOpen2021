const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
  const body = request.body

  if (body.title === undefined) {
    return response.status(400).json({error: 'title missing'})

  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog
    .save()
    .then(savedBlog => {
      response.json(savedBlog)
    })
    .catch(error => next(error))
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
  .then(blog => {
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })
  .catch(error=>next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(request.params.id)
      response.status(204).end()
    })
    .catch(error => next(error))
})
module.exports = blogsRouter