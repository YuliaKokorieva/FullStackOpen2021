import axios from 'axios'

const baseUrl = 'http://localhost:4000/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = {content, votes: 0}
  const response = await axios.post(baseUrl, object)
  return response.data
}

const addVoteService = async (anecdoteToChange) => {
  const changedAnecdote = {
    ...anecdoteToChange, votes: anecdoteToChange.votes+1
  }
  const response = await axios.put(`${baseUrl}/${changedAnecdote.id}`, changedAnecdote)
  return response.data
}

const exportedObject = { getAll, createNew, addVoteService }

export default exportedObject