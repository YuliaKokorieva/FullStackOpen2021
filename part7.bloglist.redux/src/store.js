import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import visibleReducer from "./reducers/visibleReducer";
import blogReducer from "./reducers/blogReducer";
import loginReducer from "./reducers/loginReducer";
import usersReducer from "./reducers/usersReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    visible: visibleReducer,
    blogs: blogReducer,
    loginuser: loginReducer,
    users: usersReducer
  },
});

export default store;
