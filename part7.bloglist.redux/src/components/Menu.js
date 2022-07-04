import { useEffect } from "react";
import {
  Routes, Route, Link, useNavigate, useMatch
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { initializeUsers } from "../reducers/usersReducer";
import BlogList from "./BlogList"
import Users from "./Users"
import User from "./User";
import Blog from "./Blog";

const Menu = ({blogs, loginuser, loginForm}) => {

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users)

  useEffect(()=> {
    dispatch(initializeUsers())
  }, [dispatch])

  const matchUser = useMatch('/users/:id')
  const userpage = matchUser
    ? users.find(u=>u.id===matchUser.params.id)
    : null
  
  const matchBlog = useMatch('/blogs/:id')
  const blog = matchBlog
    ? blogs.find(blog=>blog.id===matchBlog.params.id)
    : null

  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">Home</Link>
        <Link style={padding} to="/users">Users</Link>
        {loginuser === null ? (
          loginForm()
        ) : (
          <div>
            <span>
              {loginuser.name} logged-in
              <form onSubmit={() => window.localStorage.clear("")}>
                <button type="submit">logout</button>
              </form>
            </span>
          </div>
        )}
      </div>
      <Routes>
        <Route path = "/users/:id" element = {<User user={userpage}/>}/>
        <Route path="/blogs/:id" element={<Blog blog={blog} />}/>
        <Route path="/" element = {loginuser===null? null: <BlogList blogs = {blogs}/>}/>
        <Route path="/users" element = {<Users />}/>
      </Routes>
    </div>
  )
}



export default Menu