import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers:
  {
    addVote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a=>a.id===id)
      const changedAnecdote = {
        ...anecdoteToChange, votes: anecdoteToChange.votes+1
      }
      return state.map(an => 
        an.id!==id? an: changedAnecdote)    
    },
    addAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const {addAnecdote, addVote, setAnecdotes} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = text => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(text)
    dispatch(addAnecdote(newAnecdote))
  }
}

export const addVoteBE = anecdote => {
  return async dispatch => {
    const votedAnecdote = await anecdoteService.addVoteService(anecdote)
    dispatch(addVote(votedAnecdote.id))
    
  }
}

export default anecdoteSlice.reducer