import { createSlice } from '@reduxjs/toolkit'
import blogService from './services/blogs'

const blogsReducer = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      console.log(`${JSON.stringify(action.payload)} added`)
      return action.payload
    },
    appendBlog(state, action) {
      console.log(`${JSON.stringify(action.payload)} appended`)
      state.push(action.payload)
    },
  },
})

export const { setBlogs, appendBlog } = blogsReducer.actions

export const initializeBlogs = () => async dispatch => {
  const blogs = await blogService.getAll()
  dispatch(setBlogs(blogs))
}

export const createBlog = blogObject => async dispatch => {
  const newBlog = await blogService.create(blogObject)
  dispatch(appendBlog(newBlog))
}

export default blogsReducer.reducer
