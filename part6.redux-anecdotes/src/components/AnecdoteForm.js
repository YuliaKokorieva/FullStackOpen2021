import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer' 

const AnecdoteForm = (props) => {
  const dispatch = useDispatch()

  const addNewAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
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