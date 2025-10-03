import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchProfileOrders,
  selectProfileOrders,
  selectProfileOrdersLoading,
  selectProfileOrdersError
} from '../../features/orders/ordersSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '../../components/ui';
import {
  fetchIngredients,
  selectAllIngredients
} from '../../features/ingredients/ingredientsSlice';
import { selectIsAuth, selectIsInit } from '../../features/user/userSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectProfileOrders);
  const loading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  const isInit = useSelector(selectIsInit);
  const isAuth = useSelector(selectIsAuth);
  const ingredients = useSelector(selectAllIngredients);

  useEffect(() => {
    if (!ingredients.length) dispatch(fetchIngredients());
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    // Ждём, пока определится пользователь, и только если авторизован — тянем заказы
    if (isInit && isAuth && !orders.length) {
      dispatch(fetchProfileOrders());
    }
  }, [dispatch, isInit, isAuth, orders.length]);

  if (!isInit || (loading && !orders.length)) return <Preloader />;
  if (error && !orders.length)
    return <div style={{ padding: 16 }}>{error}</div>;

  return <ProfileOrdersUI orders={orders} />;
};
