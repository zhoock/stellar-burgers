// src/features/orders/ordersSlice.ts

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';
import type { RootState } from '../../services/store';
import { logoutThunk } from '../user/userSlice';

type OrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'orders/fetchProfile',
  async () => {
    const orders = await getOrdersApi(); // ← авторизованный список заказов
    return orders;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProfileOrders.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchProfileOrders.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.orders = payload;
    });
    b.addCase(fetchProfileOrders.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? 'Не удалось загрузить заказы';
    });

    // Чистим историю на логауте
    b.addCase(logoutThunk.fulfilled, (s) => {
      s.orders = [];
      s.loading = false;
      s.error = null;
    });
  }
});

export default ordersSlice.reducer;

// селекторы
export const selectProfileOrders = (s: RootState) => s.orders.orders;
export const selectProfileOrdersLoading = (s: RootState) => s.orders.loading;
export const selectProfileOrdersError = (s: RootState) => s.orders.error;
