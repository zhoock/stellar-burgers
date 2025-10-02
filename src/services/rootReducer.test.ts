import type { UnknownAction } from 'redux';
import { rootReducer } from './store';

import { initialState as userInitial } from '../features/user/userSlice';
import { initialState as ingredientsInitial } from '../features/ingredients/ingredientsSlice';
import { initialState as feedInitial } from '../features/feed/feedSlice';
import { initialState as ordersInitial } from '../features/orders/ordersSlice';
import { initialState as constructorInitial } from '../features/constructor/constructorSlice';
import { initialState as orderInitial } from '../features/order/orderSlice';
import { initialState as profileOrdersInitial } from '../features/profileOrders/profileOrdersSlice';

describe('rootReducer', () => {
  it('возвращает корректный initial state при неизвестном экшене', () => {
    const state = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    } as UnknownAction);

    expect(state).toEqual({
      user: userInitial,
      ingredients: ingredientsInitial,
      feed: feedInitial,
      orders: ordersInitial,
      burgerConstructor: constructorInitial,
      order: orderInitial,
      profileOrders: profileOrdersInitial
    });
  });
});
