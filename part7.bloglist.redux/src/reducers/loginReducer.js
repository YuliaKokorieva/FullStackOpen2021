import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";

const loginSlice = createSlice({
  name: "loginuser",
  initialState: {},
  reducers: {
    setUserRedux(state, action) {
      return action.payload;
    },
  },
});

export const { setUserRedux } = loginSlice.actions;

export default loginSlice.reducer;
