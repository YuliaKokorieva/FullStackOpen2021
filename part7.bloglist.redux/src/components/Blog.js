import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { addLikeBE } from "../reducers/blogReducer";
import { setNotificationTimeout } from "../reducers/notificationReducer";

const Blog = ({ blog, loginuser, removeBlog }) => {

  const dispatch = useDispatch()

  const [infoVisible, setInfoVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const addLike = (blog) => {
    dispatch(addLikeBE(blog))
    dispatch(setNotificationTimeout(`You liked "${blog.title}"`, 3))
  }

  

  

  return (
    <div style={blogStyle} className="blog">
      <b>Blog:</b> {blog.title} <b>by: </b> {blog.author}{" "}
      <button onClick={() => setInfoVisible(!infoVisible)} id="viewButton">
        view
      </button>
      {infoVisible 
      ? (
        <div>
          <p>{blog.url}</p>
          <div>
            likes:{blog.likes}
            <button onClick={() => addLike(blog)} id="likeButton">
              like
            </button>
          </div>
          {loginuser.id === blog.user.id || loginuser.id === blog.user ? (
            <div>
              <button onClick={() => removeBlog(blog)} id="remove-button">
                remove
              </button>
            </div>
          ) 
          : null}
        </div>
      ) : null}
    </div>
  );
};

export default Blog;
