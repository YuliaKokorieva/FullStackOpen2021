import { useSelector } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
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