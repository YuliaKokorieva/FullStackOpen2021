import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { initializeAnecdotes } from './reducers/anecdoteReducer'


const App = () => {
  const dispatch = useDispatch()
  
  useEffect(()=> {
   dispatch(initializeAnecdotes())
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