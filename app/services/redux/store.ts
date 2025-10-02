import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import restaurantReducer from "./restaurantSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    restaurant: restaurantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
