var _ = require('lodash');

const dummy = (blogs) => {
  return 1   
}

const totalLikes = (blogs)=> {
  return blogs.reduce(((sum, blog) => sum+blog.likes), 0)
}

const favoriteBlog = (blogs) => {
  var favBlog = blogs[0]

  for (var i = 1; i<blogs.length; i++) {
    if (blogs[i].likes>favBlog.likes) {
      favBlog=blogs[i]
    }
  }
  var favBlogShort = {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes    
  }
  return favBlogShort
}

const mostBlogs = (blogs) => {
  const count = _.countBy(blogs,(blog) => blog.author)
  const result = _.maxBy(_.toPairs(count))
  return { author: result[0], blogs: result[1] }
}

const mostLikes = (blogs) => {

  const groups = _.groupBy(blogs, (blog) => blog.author)
  const result = []

  for (const [key, value] of Object.entries(groups)) {
    const likes = _.sumBy(value, 'likes')
    result.push({'author': key, likes})
  }
  return final = _.maxBy(result, (a=>a.likes))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}



