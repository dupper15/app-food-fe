import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RestaurantState {
  restaurantId: string | null;
  name: string | null;
}

const initialState: RestaurantState = {
  restaurantId: null,
  name: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (
      state,
      action: PayloadAction<{ name: string; restaurantId: string }>
    ) => {
      state.name = action.payload.name;
      state.restaurantId = action.payload.restaurantId;
    },
    updateRestaurant: (
      state,
      action: PayloadAction<{ name?: string; restaurantId?: string }>
    ) => {
      if (action.payload.name !== undefined) {
        state.name = action.payload.name;
      }
      if (action.payload.restaurantId !== undefined) {
        state.restaurantId = action.payload.restaurantId;
      }
    },
  },
});

export const { setRestaurant, updateRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
