// src/components/BurgerConstructor/index.tsx
import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import type { TConstructorIngredient } from '@utils-types';
import { placeOrder, closeOrderModal } from '../../features/order/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // конструктор
  const { bun, ingredients } = useSelector((s) => s.burgerConstructor);
  // пользователь
  const user = useSelector((s) => s.user.user);
  // оформление заказа
  const { orderRequest, orderModalData } = useSelector((s) => s.order);

  const constructorItems = { bun: bun ?? undefined, ingredients };

  const onOrderClick = () => {
    // неавторизованных отправляем на логин
    if (!user) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }
    // без булки или когда уже идёт запрос — игнор
    if (!constructorItems.bun || orderRequest) return;

    // собираем ids для API: булка сверху, начинки, булка снизу
    const ids: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i: TConstructorIngredient) => i._id),
      constructorItems.bun._id
    ];

    dispatch(placeOrder(ids));
  };

  const onCloseOrderModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, v: TConstructorIngredient) => sum + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData} // <-- тут полная модель TOrder | null
      onOrderClick={onOrderClick}
      closeOrderModal={onCloseOrderModal}
    />
  );
};
