import React, {useState} from 'react'
import blogService from '../services/blogs.js'

const Blog = ({blog, setBlogs, blogs, loginuser, setErrorMessage}) => {

  const [infoVisible, setInfoVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = blog => {
    const updatedBlog={...blog, likes: blog.likes+1}
    blogService.update(updatedBlog)
    .then(returnedBlog=> {
      setBlogs(blogs.map(blog=>blog.id!==updatedBlog.id?blog:returnedBlog))
    })
    .catch(error=>{
      console.log(error)
    })
  }

  const removeBlog = blogToRemove => {
    if (window.confirm(`Delete ${blogToRemove.title}?`)) {
      blogService.remove(blogToRemove.id)
      .then(()=>{
          setBlogs(blogs.filter(blog=>blog.id!==blogToRemove.id))
          setErrorMessage(`${blogToRemove.title} deleted`)
          setTimeout(() => {        
            setErrorMessage(null)      
          }, 5000)    
        }
        )
      .catch(error=> {
        setErrorMessage("deletetion didnt succeed")
        setTimeout(() => {        
          setErrorMessage(null)      
        }, 5000)    
      })
    }
  }

  return (
  <div style = {blogStyle}>
    <b>Blog:</b> {blog.title} <b>by: </b> {blog.author} <button onClick={()=>setInfoVisible(!infoVisible)}>view</button>
    {infoVisible
      ? 
        <div>
          <p>{blog.url}</p>
          <div>likes:{blog.likes}<button onClick={()=>addLike(blog)}>like</button></div>
          {(loginuser.id===blog.user.id || loginuser.id===blog.user)
            ? <div><button onClick={()=>removeBlog(blog)}>remove</button></div>
            : null
          }

        </div>
      : null

    }
  </div>  
  )
}

export default Blog