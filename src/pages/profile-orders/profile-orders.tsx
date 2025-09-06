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

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  // чтобы дергать запрос только когда понятно, авторизованы мы или нет
  const { user, isInit } = useSelector((s) => s.user);

  const orders = useSelector(selectProfileOrders);
  const loading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    // как только приложение инициализировалось и есть пользователь — тянем свежую историю
    if (isInit && user) {
      dispatch(fetchProfileOrders());
    }
  }, [dispatch, isInit, user?.email]); // при смене пользователя подтянем его заказы

  if (!isInit || (loading && !orders.length)) return <Preloader />;
  if (error && !orders.length)
    return <div style={{ padding: 16 }}>{error}</div>;

  return <ProfileOrdersUI orders={orders} />;
};
