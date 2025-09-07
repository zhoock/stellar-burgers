// src/features/ingredients/ingredientsSlice.ts
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import type { TIngredient } from '../../utils/types';
import type { RootState } from '../../services/store'; // <— важно, чтобы тип корня был единым

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
    const items = await getIngredientsApi();
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

/* ===== БАЗОВЫЕ СЕЛЕКТОРЫ ===== */
export const selectIngredientsState = (s: RootState) => s.ingredients;
export const selectAllIngredients = (s: RootState) => s.ingredients.items;
export const selectIngredientsLoading = (s: RootState) => s.ingredients.loading;

/* словарь по _id — тоже стоит мемоизировать */
export const selectIngredientsDict = createSelector(
  [selectAllIngredients],
  (items) =>
    items.reduce<Record<string, TIngredient>>((acc, i) => {
      acc[i._id] = i;
      return acc;
    }, {})
);

/* ===== МЕМО-СЕЛЕКТОРЫ ДЛЯ ТАБОВ ===== */
export const selectBuns = createSelector([selectAllIngredients], (items) =>
  items.filter((i) => i.type === 'bun')
);
export const selectMains = createSelector([selectAllIngredients], (items) =>
  items.filter((i) => i.type === 'main')
);
export const selectSauces = createSelector([selectAllIngredients], (items) =>
  items.filter((i) => i.type === 'sauce')
);
