import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'
import { showNotification } from '../reducers/notificationReducer'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVoteTo(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(anecdote => anecdote.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }
      return state
        .map(anecdote =>
          anecdote.id !== id ? anecdote : changedAnecdote
        )
        .sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteForAnecdote = (id) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.vote(id)
    dispatch(addVoteTo(id))
    dispatch(showNotification(`you voted for '${anecdote.content}'`, 5))
  }
}

export const { addVoteTo, setAnecdotes, appendAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer