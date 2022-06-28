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

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const blogFormRef = useRef();
  const dispatch = useDispatch()

  const visible = useSelector(state=>state.visible)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

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

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs([...blogs, returnedBlog]);
      dispatch(setNotification(`a new blog "${blogObject.title}" by ${blogObject.author} added successfully`))

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
  };

  const addLike = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    blogService
      .update(updatedBlog)
      .then((returnedBlog) => {
        setBlogs(
          blogs.map((blog) =>
            blog.id !== updatedBlog.id ? blog : returnedBlog
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
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
      <BlogForm createBlog={addBlog} />
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
          <p>
            {user.name} logged-in
            <form onSubmit={() => window.localStorage.clear("")}>
              <button type="submit">logout</button>
            </form>
          </p>
          {blogForm()}
          <h3>List of blogs</h3>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                loginuser={user}
                addLike={addLike}
                removeBlog={removeBlog}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
