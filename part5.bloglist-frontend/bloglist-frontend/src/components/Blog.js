import React from 'react'
const Blog = ({blog}) => (
  <div>
    <b>Blog:</b> {blog.title} <b>by: </b> {blog.author}
  </div>  
)

export default Blog