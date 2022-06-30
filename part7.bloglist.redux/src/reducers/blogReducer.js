import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },

    addBlog(state, action) {
      state.push(action.payload);
    },

    addLike(state, action) {
      const id = action.payload;
      const blogToChange = state.find((b) => b.id === id);
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1,
      };
      return state.map((blog) => (blog.id !== id ? blog : changedBlog));
    },

    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => {
        return blog.id != id;
      });
    },
  },
});

export const { setBlogs, addBlog, addLike, removeBlog } = blogSlice.actions;
export default blogSlice.reducer;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(addBlog(newBlog));
  };
};

export const addLikeBE = (blog) => {
  return async (dispatch) => {
    const likedBlog = await blogService.update(blog);
    dispatch(addLike(likedBlog.id));
  };
};

export const removeBlogBE = (blogToDelete) => {
  return async (dispatch) => {
    blogService.remove(blogToDelete.id);
    dispatch(removeBlog(blogToDelete.id));
  };
};
