import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { TIngredient, TConstructorIngredient } from '../../utils/types';

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[]; // начинки/соусы, с уникальным id для списка
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addItem: (state, { payload }: PayloadAction<TIngredient>) => {
      if (payload.type === 'bun') {
        state.bun = payload; // булка одна — просто заменяем
      } else {
        state.ingredients.push({ ...payload, id: nanoid() });
      }
    },
    removeItem: (state, { payload }: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((i) => i.id !== payload);
    },
    moveItem: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const item = state.ingredients.splice(from, 1)[0];
      state.ingredients.splice(to, 0, item);
    },
    clear: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const { addItem, removeItem, moveItem, clear } =
  constructorSlice.actions;
export default constructorSlice.reducer;
