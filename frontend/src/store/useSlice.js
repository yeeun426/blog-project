import { createSlice } from '@reduxjs/toolkit'

export const user = createSlice({
  name: 'user',
  initialState: {
    user: '',
  },
  reducers: {
    setUserInfo: (state, actions) => {
      state.user = actions.payload
    },
  },
})

export const { setUserInfo } = user.actions
