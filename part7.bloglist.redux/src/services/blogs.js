import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;
const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (blogToUpdate) => {
  const config = {
    headers: { Authorization: token },
  };
  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  };
  const response = await axios.put(
    `http://localhost:3003/api/blogs/${updatedBlog.id}`,
    updatedBlog,
    config
  );
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(
    `http://localhost:3003/api/blogs/${id}`,
    config
  );
  return response.data;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const blogService = {
  getAll,
  create,
  setToken,
  update,
  remove,
};

export default blogService;
