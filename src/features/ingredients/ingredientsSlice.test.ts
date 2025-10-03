// src/features/ingredients/ingredientsSlice.test.ts
import reducer, { fetchIngredients, initialState } from './ingredientsSlice';
import type { UnknownAction } from 'redux';
import type { TIngredient } from '../../utils/types';

describe('ingredientsSlice', () => {
  it('unknown action → возвращает initialState', () => {
    const next = reducer(undefined, {
      type: 'UNKNOWN_ACTION'
    } as UnknownAction);
    expect(next).toEqual(initialState);
  });

  it('pending → loading = true', () => {
    const action = fetchIngredients.pending('req1', undefined);
    const next = reducer(undefined, action);
    expect(next.loading).toBe(true);
    expect(next.error).toBeNull();
  });

  it('fulfilled → кладёт items и loading=false', () => {
    const payload: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 10,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ];
    const action = fetchIngredients.fulfilled(payload, 'req1', undefined);
    const next = reducer(undefined, action);
    expect(next.loading).toBe(false);
    expect(next.items).toHaveLength(1);
    expect(next.items[0]._id).toBe('1');
  });

  it('rejected → пишет error и loading=false', () => {
    const action = fetchIngredients.rejected(
      new Error('boom'),
      'req1',
      undefined
    );
    const next = reducer(undefined, action);
    expect(next.loading).toBe(false);
    expect(next.error).toBe('boom'); // SerializedError.message попадёт сюда
  });
});
