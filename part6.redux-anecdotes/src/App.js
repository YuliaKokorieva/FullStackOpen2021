import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import anecdoteService from './services/anecdotes'
import { setAnecdotes } from './reducers/anecdoteReducer'


const App = () => {
  const dispatch = useDispatch()
  useEffect(()=> {
    anecdoteService
      .getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))
  }, [dispatch])
  const visible = useSelector(state=>state.visible)

  return (
    <div>
      <h2>Anecdotes</h2>
      {visible
        ?<Notification/>
        : null}
      <Filter />
      <AnecdoteList />  
      <AnecdoteForm />
   
    </div>
  )
}

export default App