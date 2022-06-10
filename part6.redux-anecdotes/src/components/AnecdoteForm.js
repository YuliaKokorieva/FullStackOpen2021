import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer' 
import { setNotification } from '../reducers/notificationReducer'
import { setVisible, setInvisible } from '../reducers/visibleReducer'


const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addNewAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(setNotification(`You created "${content}"`))
    dispatch(setVisible())
    setTimeout(()=> {
      dispatch(setInvisible())
    }, 5000)
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addNewAnecdote}>
        <input name="anecdote" />
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default AnecdoteForm