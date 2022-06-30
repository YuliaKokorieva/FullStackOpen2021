import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import { setNotification } from "./reducers/notificationReducer";
import { useSelector, useDispatch } from 'react-redux'
import { setVisible, setInvisible } from "./reducers/visibleReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import store from "./store";

const App = () => {
  // const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();
  const dispatch = useDispatch()

  const visible = useSelector(state=>state.visible)
  const blogs = useSelector(state=>state.blogs).slice().sort((a, b) => b.likes - a.likes)

  useEffect(()=> {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        "loggedBloglistappUser",
        JSON.stringify(user)
      );

      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("wrong credentials"));
      dispatch(setVisible())
      setTimeout(()=> {
        dispatch(setInvisible())
      }, 3000)
    }
  };

  const removeBlog = (blogToRemove) => {
    if (window.confirm(`Delete ${blogToRemove.title}?`)) {
      blogService
        .remove(blogToRemove.id)
        .then(() => {
          setBlogs(blogs.filter((blog) => blog.id !== blogToRemove.id));
          dispatch(setNotification(`${blogToRemove.title} deleted`));
          dispatch(setVisible())
          setTimeout(()=> {
            dispatch(setInvisible())
          }, 3000)
        })
        .catch((error) => {
          dispatch(setNotification("deletetion didnt succeed"));
          dispatch(setVisible())
          setTimeout(()=> {
            dispatch(setInvisible())
          }, 3000)
        });
    }
  };

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm  />
    </Togglable>
  );

  return (
    <div>
      <h2>Bloglist App</h2>
      {visible
        ?<Notification/>
        : null}

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <span>
            {user.name} logged-in
            <form onSubmit={() => window.localStorage.clear("")}>
              <button type="submit">logout</button>
            </form>
          </span>
          {blogForm()}
          <h3>List of blogs</h3>
          {blogs
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                loginuser={user}
                // addLike={addLike}
                // removeBlog={removeBlog}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
