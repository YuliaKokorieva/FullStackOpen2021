import { createSlice } from '@reduxjs/toolkit'
import { setVisible, setInvisible} from '../reducers/visibleReducer'

const notification = ""
const initialState = notification

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    }
  }

})
export const {setNotification}=notificationSlice.actions

export const setNotificationTimeout = (message, secs) => {
  return dispatch => {
    dispatch(setNotification(message))
    dispatch(setVisible())
    setTimeout(()=> {
      dispatch(setInvisible())
    }, secs*1000)
  }
}

export default notificationSlice.reducer