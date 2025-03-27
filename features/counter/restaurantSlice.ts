import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurantId: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (state, action) => {
      state.restaurantId = action.payload;
    },
  },
});

export const { setRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
