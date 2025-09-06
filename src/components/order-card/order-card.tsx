// src/components/OrderCard/index.tsx
import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectAllIngredients } from '../../features/ingredients/ingredientsSlice';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { OrderCardProps } from './type';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useSelector(selectAllIngredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], id) => {
        const ing = ingredients.find((x) => x._id === id);
        if (ing) acc.push(ing);
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((sum, i) => sum + i.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    return {
      ...order,
      date: new Date(order.createdAt),
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }} // клик — модалка по /feed/:number
    />
  );
});
