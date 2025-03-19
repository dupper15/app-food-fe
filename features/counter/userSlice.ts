import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  token: null, // Nếu dùng JWT
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token || null;
    },
    logout: (state) => {
      state.userId = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
