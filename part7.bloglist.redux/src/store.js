import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import visibleReducer from "./reducers/visibleReducer";
import blogReducer from "./reducers/blogReducer";
import loginReducer from "./reducers/loginReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    visible: visibleReducer,
    blogs: blogReducer,
    loginuser: loginReducer,
  },
});

export default store;
