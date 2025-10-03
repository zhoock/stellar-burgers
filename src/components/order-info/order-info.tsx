// src/components/OrderInfo/index.tsx
import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import type { RootState } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import type { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { fetchIngredients } from '../../features/ingredients/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number?: string }>();
  const dispatch = useDispatch();

  const allIngredients = useSelector((s: RootState) => s.ingredients.items);
  const ingredientsLoading = useSelector(
    (s: RootState) => s.ingredients.loading
  );
  const ingredientsError = useSelector((s: RootState) => s.ingredients.error);

  // пробуем найти заказ в уже загруженном фиде
  const feedOrder = useSelector((s: RootState) =>
    s.feed.orders.find((o) => o.number === Number(number))
  );

  const [orderData, setOrderData] = useState<TOrder | null>(feedOrder ?? null);
  const [loading, setLoading] = useState<boolean>(!feedOrder);
  const [error, setError] = useState<string | null>(null);

  // 1) Если ингредиенты ещё не загружены — подтянем
  useEffect(() => {
    if (!allIngredients.length && !ingredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, allIngredients.length, ingredientsLoading]);

  // 2) Если заказ появился/обновился во фиде — синхронизируем локальный стейт
  useEffect(() => {
    if (feedOrder) {
      setOrderData(feedOrder);
      setLoading(false);
      setError(null);
    }
  }, [feedOrder]);

  // 3) Если не нашли в фиде — подтянем по номеру (публичный эндпоинт)
  useEffect(() => {
    let active = true;
    if (!feedOrder && number) {
      setLoading(true);
      setError(null);
      getOrderByNumberApi(Number(number))
        .then((res) => {
          if (!active) return;
          const found = res.orders?.[0] ?? null;
          setOrderData(found);
          if (!found) setError('Заказ не найден');
        })
        .catch((e) => {
          if (!active) return;
          setError(e?.message ?? 'Не удалось загрузить заказ');
        })
        .finally(() => active && setLoading(false));
    }
    return () => {
      active = false;
    };
  }, [number, feedOrder]);

  const orderInfo = useMemo(() => {
    if (!orderData || !allIngredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce<
      Record<string, TIngredient & { count: number }>
    >((acc, id) => {
      const ing = allIngredients.find((i) => i._id === id);
      if (!ing) return acc;
      if (!acc[id]) acc[id] = { ...ing, count: 1 };
      else acc[id].count += 1;
      return acc;
    }, {});

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, allIngredients]);

  if (ingredientsError)
    return <div style={{ padding: 16 }}>{ingredientsError}</div>;
  if (error) return <div style={{ padding: 16 }}>{error}</div>;
  if (loading || !orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
