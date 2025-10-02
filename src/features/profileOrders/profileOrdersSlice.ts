import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';
import type { RootState } from '../../services/store';
import { logoutThunk } from '../user/userSlice';

type ProfileOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

export const initialState: ProfileOrdersState = {
  orders: [],
  loading: false,
  error: null
};

// авторизованный запрос: только заказы текущего пользователя
export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetch',
  async () => {
    const orders = await getOrdersApi(); // возвращает массив заказов пользователя
    return orders;
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    clearProfileOrders: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    }
  },
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

    // важное: чистим при выходе из аккаунта, чтобы не «текли» заказы между пользователями
    b.addCase(logoutThunk.fulfilled, (s) => {
      s.orders = [];
      s.loading = false;
      s.error = null;
    });
  }
});

export default profileOrdersSlice.reducer;
export const { clearProfileOrders } = profileOrdersSlice.actions;

// селекторы
export const selectProfileOrders = (s: RootState) => s.profileOrders.orders;
export const selectProfileOrdersLoading = (s: RootState) =>
  s.profileOrders.loading;
export const selectProfileOrdersError = (s: RootState) => s.profileOrders.error;
