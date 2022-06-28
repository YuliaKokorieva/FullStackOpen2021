import { createSlice } from '@reduxjs/toolkit'

const  initialState=false

const visibleSlice = createSlice({
  name: 'visible',
  initialState,
  reducers: {
    setVisible(state, action) {
      return true
    },
    setInvisible(state, action) {
      return false
    }
  }
})

export const {setVisible, setInvisible} = visibleSlice.actions
export default visibleSlice.reducer