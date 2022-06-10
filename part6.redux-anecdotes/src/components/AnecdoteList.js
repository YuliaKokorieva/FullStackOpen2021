import { useDispatch, useSelector } from 'react-redux'
import { setNotificationTimeout } from '../reducers/notificationReducer'

import { addVoteBE } from '../reducers/anecdoteReducer'

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
    dispatch(addVoteBE(anecdote))
    dispatch(setNotificationTimeout(`You voted for "${anecdote.content}"`, 3))

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