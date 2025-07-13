import { createSlice } from '@reduxjs/toolkit'

const userReducer = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    logoutUser() {
      return null
    },
  },
})

export const { setUser, logoutUser } = userReducer.actions
export default userReducer.reducer
