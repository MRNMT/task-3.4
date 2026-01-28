import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import shoppingListReducer from './slices/shoppingListSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shoppingList: shoppingListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
