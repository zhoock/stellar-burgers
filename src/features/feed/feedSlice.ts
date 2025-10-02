// src/features/feed/feedSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';
import type { RootState } from '../../services/store'; // ВАЖНО: type-only импорт

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

export const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchFeed = createAsyncThunk('feed/fetch', async () => {
  const data = await getFeedsApi(); // { orders, total, totalToday }
  return data;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orders = payload.orders;
        state.total = payload.total;
        state.totalToday = payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ленту';
      });
  }
});

export default feedSlice.reducer;

export const selectFeedOrders = (s: RootState) => s.feed.orders;
export const selectFeedLoading = (s: RootState) => s.feed.loading;
export const selectFeedError = (s: RootState) => s.feed.error;
export const selectFeedTotals = (s: RootState) => ({
  total: s.feed.total,
  totalToday: s.feed.totalToday
});
