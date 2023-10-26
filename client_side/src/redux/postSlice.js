import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchPostStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPostSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchPostFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearPostData(state){
      state.data = null;
    }
  },
});

export const { fetchPostStart, fetchPostSuccess, fetchPostFailure, clearPostData } = postSlice.actions;
export default postSlice.reducer;
