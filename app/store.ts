import { configureStore } from "@reduxjs/toolkit";
import { useReducer } from "react";
import userReducer from "@/features/counter/userSlice";
import restaurantReducer from "@/features/counter/restaurantSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    restaurant: restaurantReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
