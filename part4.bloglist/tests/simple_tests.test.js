const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const listHelper = require('../utils/list_helper')

describe('dummy:', ()=> {
  test('returns one', () => {
    const blogs = []
      
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = 
      [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          likes: 5,
          __v: 0
        }
      ]
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('for the list of blogs equals to the sum of likes of all blogs in the array', () => {
    const result =listHelper.totalLikes(helper.initialBlogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog', () => {
  test('is the one with most likes', () => {
    const favBlog = 
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
    const result = listHelper.favoriteBlog(helper.initialBlogs)
    expect(result).toEqual(favBlog)
  })
})

describe('most blogs', ()=> {
  test('author with most blogs', () => {
    const mostBlogs = 
    {
        author: "Robert C. Martin",
        blogs: 3
    }
    const result = listHelper.mostBlogs(helper.initialBlogs)
    expect(result).toEqual(mostBlogs)
  })
})

describe('most likes', ()=> {
  test('author with most likes', () => {
    const mostLikes = 
    {
        author: "Edsger W. Dijkstra",
        likes: 17
    }
    const result = listHelper.mostLikes(helper.initialBlogs)
    expect(result).toEqual(mostLikes)
  })

})

afterAll(() => {
  mongoose.connection.close()
})

