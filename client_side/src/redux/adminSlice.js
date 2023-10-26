/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blockedUsers: []
};


const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    blockedUser: (state, action) => {
      state.blockedUsers.push(action.payload);
    },
    unblockUser: (state, action) => {
      state.blockedUsers = state.blockedUsers.filter(
        (userId) => userId !== action.payload
      );
    },
  },
});

export const { blockedUser, unblockUser } = adminSlice.actions;
export default adminSlice.reducer;
