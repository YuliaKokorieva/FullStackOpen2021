import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { setVisible, setInvisible} from '../reducers/visibleReducer'

const AnecdoteList =() => {
  const filter = useSelector(state=>state.filter)
  const anecdotes = useSelector(state => state.anecdotes)

  var filtered

  if (!filter) {
    filtered = [...anecdotes]
  } else {
    filtered = anecdotes.filter(an=>an.content.toLowerCase().includes(filter.toLowerCase()))
  }
  const sorted = filtered.slice().sort((a,b)=>b.votes-a.votes)
  const dispatch = useDispatch()

  const handleClick = (anecdote)=> {
    dispatch(addVote(anecdote.id))
    dispatch(setNotification(`You voted for "${anecdote.content}"`))
    dispatch(setVisible())
    setTimeout(()=> {
      dispatch(setInvisible())
    }, 5000)
  }

  return(
    <div>
      <h2>Anecdotes</h2>
      {sorted.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={()=>handleClick(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList