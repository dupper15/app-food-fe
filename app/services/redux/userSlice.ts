import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  token: null, // Nếu dùng JWT
  image: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token || null;
      state.image = action.payload.image;
    },
    updateUser: (state, action) => {
      if (action.payload.image !== undefined) {
        state.image = action.payload.image;
      }
    },
    logout: (state) => {
      state.userId = null;
      state.token = null;
    },
  },
});

export const { setUser, updateUser, logout } = userSlice.actions;
export default userSlice.reducer;
