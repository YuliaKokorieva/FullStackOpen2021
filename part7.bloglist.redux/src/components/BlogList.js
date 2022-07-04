import Blog from "./Blog";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import React, { useRef } from "react";

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
        <Blog key={blog.id} blog={blog} />
      ))}
      {blogForm()}

    </div>
  )
}

export default BlogList