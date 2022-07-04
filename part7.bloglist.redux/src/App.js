import React, { useState, useEffect } from "react";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import Menu from "./components/Menu";
import { setNotificationTimeout } from "./reducers/notificationReducer";
import { useSelector, useDispatch } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { setUserRedux } from "./reducers/loginReducer";
import blogService from "./services/blogs";
import loginService from "./services/login";
import store from "./store";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();

  const visible = useSelector((state) => state.visible);
  const blogs = useSelector((state) => state.blogs)
    .slice()
    .sort((a, b) => b.likes - a.likes);


  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

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
      dispatch(setUserRedux(user));
      console.log(store.getState());
    } catch (exception) {
      dispatch(setNotificationTimeout("wrong credentials", 3));
    }
  };

  return (
    <div>
      <h2>Bloglist App</h2>
      {visible ? <Notification /> : null}
      <Menu blogs = {blogs} loginuser = {user} loginForm = {loginForm}/>

    </div>
  );
};

export default App;
