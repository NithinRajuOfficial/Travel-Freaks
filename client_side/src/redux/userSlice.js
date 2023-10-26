import { createSlice } from "@reduxjs/toolkit";

const userToken = localStorage.getItem("accessToken");

// defining the initial state
const initialState = {
  user: {
    name: "",
    bio: "",
    profileImage: "",
  },
  isAuthenticated: userToken ? true : false,
};

// Create a Redux Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Filter out sensitive data and update user data and isAuthenticated
      const { _id, name, bio, profileImage, coverImg } = action.payload;
      state.user = {
        _id,
        name,
        bio,
        profileImage,
        coverImg
      };
      state.isAuthenticated = true;
    },

    clearUser: (state) => {
      // this action clears user data and updates the isAuthenticated
      state.user = null;
      state.isAuthenticated = false;
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true;
    },
  },
});

// export actions from UserSlice
export const { setUser, clearUser, loginSuccess } = userSlice.actions;

export const selectIsLoggedIn = (state) => state.user.isAuthenticated;

// export reducer
export default userSlice.reducer;
