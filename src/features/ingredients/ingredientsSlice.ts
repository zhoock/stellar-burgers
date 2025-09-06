import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import type { TIngredient } from '../../utils/types';

type IngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const items = await getIngredientsApi(); // уже возвращает массив ингредиентов
    return items;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchIngredients.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchIngredients.rejected, (s, a) => {
      s.loading = false;
      s.error = String(a.error.message || 'Ошибка');
    });
    b.addCase(
      fetchIngredients.fulfilled,
      (s, { payload }: PayloadAction<TIngredient[]>) => {
        s.loading = false;
        s.items = payload;
      }
    );
  }
});

export default ingredientsSlice.reducer;

export const selectAllIngredients = (s: { ingredients: IngredientsState }) =>
  s.ingredients.items;
export const selectIngredientsDict = (s: { ingredients: IngredientsState }) =>
  s.ingredients.items.reduce<Record<string, TIngredient>>(
    (acc, i) => ((acc[i._id] = i), acc),
    {}
  );
export const selectIngredientsLoading = (s: {
  ingredients: IngredientsState;
}) => s.ingredients.loading;
