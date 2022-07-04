import Blog from "./Blog";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import React, { useRef } from "react";
import { Link } from "react-router-dom"

const BlogList = ({blogs}) => {

  const blogFormRef = useRef();

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm />
    </Togglable>
  );

  return(
    <div>

      <h2>List of blogs</h2>
      {blogs.map((blog) => (
        <p key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></p>
      ))}
      {blogForm()}

    </div>
  )
}

export default BlogList