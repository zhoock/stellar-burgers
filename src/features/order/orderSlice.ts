import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';
import { clear } from '../constructor/constructorSlice';

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

export const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const placeOrder = createAsyncThunk(
  'order/place',
  async (ids: string[], { dispatch, rejectWithValue }) => {
    try {
      const res = await orderBurgerApi(ids); // { order, name }
      // ✔ после успешного заказа очищаем конструктор
      dispatch(clear());
      return res.order as TOrder;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Не удалось оформить заказ');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (b) => {
    b.addCase(placeOrder.pending, (s) => {
      s.orderRequest = true;
      s.error = null;
    });
    b.addCase(placeOrder.fulfilled, (s, { payload }: PayloadAction<TOrder>) => {
      s.orderRequest = false;
      s.orderModalData = payload; // покажем модалку с номером заказа
    });
    b.addCase(placeOrder.rejected, (s, a) => {
      s.orderRequest = false;
      s.error = String(a.payload ?? a.error.message ?? 'Ошибка заказа');
    });
  }
});

export const { closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
