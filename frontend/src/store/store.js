import { configureStore } from '@reduxjs/toolkit'
import { user } from './useSlice'

export default configureStore({
  reducer: {
    user: user.reducer,
  },
})
