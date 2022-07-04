import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initializeUsers } from "../reducers/usersReducer";
import { Link } from "react-router-dom"


const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users)

  useEffect(()=> {
    dispatch(initializeUsers())
  }, [dispatch])


  return(
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th> </th><th>Blogs created</th>
          </tr>
          {users.map((user) => (
            <tr><td><Link to={`/users/${user.id}`}>{user.name}</Link></td><td>{user.blogs.length}</td></tr>
          ))}
      </tbody>

      </table>

    </div>
  )
}

export default Users