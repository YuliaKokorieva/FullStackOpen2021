import axios from "axios";

const getAll = async () => {
  return (await axios.get('http://localhost:3003/api/users')).data
}

const userService = {
  getAll
}

export default userService