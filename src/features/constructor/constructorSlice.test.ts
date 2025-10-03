// src/features/constructor/constructorSlice.test.ts
import reducer, {
  addItem,
  removeItem,
  moveItem,
  clear
} from './constructorSlice';
import type { TIngredient } from '../../utils/types';

const bun: TIngredient = {
  _id: 'bun1',
  name: 'Булка 1',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 10,
  image: '',
  image_mobile: '',
  image_large: ''
};

const mainIng: TIngredient = {
  _id: 'main1',
  name: 'Котлета',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 25,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('constructorSlice', () => {
  it('добавление булки', () => {
    const state = reducer(undefined, addItem(bun));
    expect(state.bun?._id).toBe('bun1');
    expect(state.ingredients.length).toBe(0);
  });

  it('добавление начинки', () => {
    const state = reducer(undefined, addItem(mainIng));
    expect(state.ingredients.length).toBe(1);
    // у элемента появится сгенерированный id — проверим по полям, кроме id
    const added = state.ingredients[0];
    expect(added._id).toBe('main1');
    expect(added.price).toBe(25);
  });

  it('удаление начинки по id', () => {
    const afterAdd = reducer(undefined, addItem(mainIng));
    const id = afterAdd.ingredients[0].id!;
    const afterRemove = reducer(afterAdd, removeItem(id));
    expect(afterRemove.ingredients.length).toBe(0);
  });

  it('перемещение начинки', () => {
    const s1 = reducer(undefined, addItem(mainIng));
    const s2 = reducer(s1, addItem({ ...mainIng, _id: 'main2', name: 'Сыр' }));
    const moved = reducer(s2, moveItem({ from: 0, to: 1 }));
    expect(moved.ingredients.map((i) => i._id)).toEqual(['main2', 'main1']);
  });

  it('очистка конструктора', () => {
    const s1 = reducer(undefined, addItem(bun));
    const s2 = reducer(s1, addItem(mainIng));
    const cleared = reducer(s2, clear());
    expect(cleared.bun).toBeNull();
    expect(cleared.ingredients).toHaveLength(0);
  });
});
