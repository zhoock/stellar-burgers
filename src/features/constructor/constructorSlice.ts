// src/features/constructor/constructorSlice.ts
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { TIngredient, TConstructorIngredient } from '../../utils/types';

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: ConstructorState = { bun: null, ingredients: [] };

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addItem: {
      reducer(
        state,
        { payload }: PayloadAction<TIngredient | TConstructorIngredient>
      ) {
        if (payload.type === 'bun') {
          state.bun = payload as TIngredient;
        } else {
          state.ingredients.push(payload as TConstructorIngredient);
        }
      },
      // ГЕНЕРАЦИЯ id тут — до редьюсера
      prepare(item: TIngredient) {
        return {
          payload:
            item.type === 'bun'
              ? item
              : ({ ...item, id: nanoid() } as TConstructorIngredient)
        };
      }
    },
    removeItem(state, { payload }: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter((i) => i.id !== payload);
    },
    moveItem(state, { payload }: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = payload;
      const item = state.ingredients.splice(from, 1)[0];
      state.ingredients.splice(to, 0, item);
    },
    clear(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const { addItem, removeItem, moveItem, clear } =
  constructorSlice.actions;
export default constructorSlice.reducer;
