import React, { useState } from "react";
import { useDispatch } from 'react-redux'
import { setNotification } from "../reducers/notificationReducer";
import { setVisible, setInvisible } from "../reducers/visibleReducer";
import { createBlog } from "../reducers/blogReducer";

const BlogForm = () => {

  const dispatch = useDispatch()

  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: 0,
  });

  const inputChanged = (event) => {
    setNewBlog({ ...newBlog, [event.target.name]: event.target.value });
  };

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      dispatch(createBlog(newBlog))
      dispatch(setNotification(
        `a new blog "${newBlog.title}" by ${newBlog.author} added successfully`
      ))
      dispatch(setVisible())
      setTimeout(()=> {
        dispatch(setInvisible())
      }, 3000)
    } catch (error) {
      dispatch(setNotification("not saved, error: " + error.message));
      dispatch(setVisible())
      setTimeout(()=> {
        dispatch(setInvisible())
      }, 3000)
    }
  }

  return (
    <div>
      <h3>Create a new blog post</h3>
      <form onSubmit={addBlog}>
        <table>
          <tbody>
            <tr>
              <td>Title:</td>
              <td>
                <input
                  name="title"
                  type="text"
                  value={newBlog.title}
                  onChange={inputChanged}
                  placeholder="title"
                  id="input-title"
                />
              </td>
            </tr>
            <tr>
              <td>Author</td>
              <td>
                <input
                  name="author"
                  type="text"
                  value={newBlog.author}
                  onChange={inputChanged}
                  placeholder="author"
                  id="input-author"
                />
              </td>
            </tr>
            <tr>
              <td>URL</td>
              <td>
                <input
                  name="url"
                  type="text"
                  value={newBlog.url}
                  onChange={inputChanged}
                  placeholder="url"
                  id="input-url"
                />
              </td>
            </tr>
            <tr>
              <td>Number of likes</td>
              <td>
                <input
                  name="likes"
                  type="number"
                  value={newBlog.likes}
                  onChange={inputChanged}
                />
              </td>
            </tr>
            <tr>
              <td>
                <button type="submit" id="save-button">
                  save
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};
export default BlogForm;
