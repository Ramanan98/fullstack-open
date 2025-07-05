import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'initial value',
  reducers: {
    notificationState(state, action) {
      return action.payload
    }
  }
})

export const { notificationState: filterChange } = notificationSlice.actions
export default notificationSlice.reducer