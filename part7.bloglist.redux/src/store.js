import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import visibleReducer from './reducers/visibleReducer'


const store = configureStore({
  reducer: {
    notification: notificationReducer,
    visible: visibleReducer
  }
})

export default store