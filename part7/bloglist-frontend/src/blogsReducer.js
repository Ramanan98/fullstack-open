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
      state.push(action.payload)
      console.log(`${JSON.stringify(action.payload)} appended`)
    },
    updateBlog(state, action) {
      const updated = action.payload
      console.log(`${JSON.stringify(action.payload)} updated`)
      return state.map(blog => (blog.id !== updated.id ? blog : updated))
    },
    removeBlog(state, action) {
      const id = action.payload
      console.log(`${JSON.stringify(action.payload)} removed`)
      return state.filter(blog => blog.id !== id)
    },
  },
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogsReducer.actions

export const initializeBlogs = () => async dispatch => {
  const blogs = await blogService.getAll()
  dispatch(setBlogs(blogs))
}

export const createBlog = blogObject => async dispatch => {
  const newBlog = await blogService.create(blogObject)
  dispatch(appendBlog(newBlog))
}

export const likeBlog = (id, blogObject) => async dispatch => {
  const updatedBlog = await blogService.update(id, blogObject)
  dispatch(updateBlog(updatedBlog))
}

export const deleteBlog = id => async dispatch => {
  await blogService.deleteBlog(id)
  dispatch(removeBlog(id))
}

export default blogsReducer.reducer
