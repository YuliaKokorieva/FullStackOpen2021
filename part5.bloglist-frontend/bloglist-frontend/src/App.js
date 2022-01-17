import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login' 
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
    likes: 0
  })

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {    
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      blogService.setToken(user.token)    
    }  
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const handleLogin = async (event) => {
    event.preventDefault()
    try {      
      const user = await loginService.login({        
        username, password,      
      })  
      
      window.localStorage.setItem(        
        'loggedBloglistappUser', JSON.stringify(user)      
      ) 

      blogService.setToken(user.token)
      
      setUser(user)      
      setUsername('')      
      setPassword('')    
    } catch (exception) {      
      setErrorMessage('wrong credentials')      
      setTimeout(() => {        
        setErrorMessage(null)      
      }, 5000)    }
  }

  const inputChanged = (event) => {
    setNewBlog({...newBlog, [event.target.name]: event.target.value })
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs([...blogs, returnedBlog])


      setErrorMessage(`a new blog "${newBlog.title}" by ${newBlog.author} added successfully`)
      setTimeout(() => {        
        setErrorMessage(null)      
      }, 5000)   
      setNewBlog({
        title: '',
        author: '',
        url: '',
        likes: 0
      })
    
    } catch (error) {
      setErrorMessage('not saved, error: ' + error.message)
      setTimeout(() => {        
        setErrorMessage(null)      
      }, 5000)   
    }
  }

  return (
    <div>
      <h2>Bloglist App</h2>
      <Notification message={errorMessage} />

      {user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged-in
          <form onSubmit =  {()=> window.localStorage.clear('')}><button type = "submit">logout</button></form>
        </p>
        <h3>List of blogs</h3>
        {blogs.map(blog =><Blog key={blog.id} blog={blog} />)}
        <div>
          <h3>Create a new blog post</h3>
          <form onSubmit = {addBlog}>
            <table>
              <tr><td>Title:</td><td><input name="title" type="text" value = {newBlog.title} onChange={inputChanged}/></td></tr>
              <tr><td>Author</td><td><input name="author" type="text" value = {newBlog.author} onChange={inputChanged}/></td></tr>
              <tr><td>URL</td><td><input name="url" type="text" value = {newBlog.url} onChange={inputChanged}/></td></tr>
              <tr><td>Number of likes</td><td><input name="likes" type="number" value = {newBlog.likes} onChange={inputChanged}/></td></tr>
              <tr><td><button type="submit">save</button></td></tr>
            </table>
           </form>
        </div>
      </div>
    }

    </div>
  )
}

export default App