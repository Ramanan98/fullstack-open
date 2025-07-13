import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import commentsService from '../services/comments'

const blogsReducer = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updated = action.payload
      return state.map(blog => (blog.id !== updated.id ? blog : updated))
    },
    removeBlog(state, action) {
      const id = action.payload
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

export const addComment = (blogId, comment) => async dispatch => {
  const updatedBlog = await commentsService.addComment(blogId, comment)
  dispatch(updateBlog(updatedBlog))
}

export const deleteBlog = id => async dispatch => {
  await blogService.deleteBlog(id)
  dispatch(removeBlog(id))
}

export default blogsReducer.reducer
