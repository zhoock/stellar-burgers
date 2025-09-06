// src/services/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import userReducer from '../features/user/userSlice';
import ingredientsReducer from '../features/ingredients/ingredientsSlice';
import feedReducer from '../features/feed/feedSlice';
import constructorReducer from '../features/constructor/constructorSlice';
import ordersReducer from '../features/orders/ordersSlice';
import orderReducer from '../features/order/orderSlice';
import profileOrdersReducer from '../features/profileOrders/profileOrdersSlice';

const rootReducer = combineReducers({
  user: userReducer, // ← ключ 'user' даёт state.user
  ingredients: ingredientsReducer,
  feed: feedReducer,
  orders: ordersReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  profileOrders: profileOrdersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
