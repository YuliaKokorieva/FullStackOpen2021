import React, {useState} from 'react'


const BlogForm = ({createBlog}) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
    likes: 0
  })

  const inputChanged = (event) => {
    setNewBlog({...newBlog, [event.target.name]: event.target.value })
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)     
    setNewBlog({
      title: '',
      author: '',
      url: '',
      likes: 0
    })
  }

  
  return (
    <div>
      <h3>Create a new blog post</h3>
        <form onSubmit = {addBlog}>
        <table>
          <tbody>
            <tr>
              <td>Title:</td>
              <td><input 
                name="title" 
                type="text" 
                value = {newBlog.title} 
                onChange={inputChanged}
                />
              </td>
            </tr>
            <tr>
              <td>Author</td>
              <td>
                <input 
                  name="author" 
                  type="text" 
                  value = {newBlog.author} 
                  onChange={inputChanged}
                  />
              </td>
            </tr>
            <tr>
              <td>URL</td>
              <td><input 
                name="url" 
                type="text" 
                value = {newBlog.url} 
                onChange={inputChanged}/>
              </td>
            </tr>
            <tr>
              <td>Number of likes</td>
              <td><input 
                name="likes" 
                type="number" 
                value = {newBlog.likes} 
                onChange={inputChanged}/>
              </td>
            </tr>
            <tr>
              <td><button type="submit">save</button></td>
            </tr>
          </tbody>
        </table>
        </form>
        </div>
    )
}
export default BlogForm
