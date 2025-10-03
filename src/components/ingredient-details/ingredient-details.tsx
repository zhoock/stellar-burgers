// src/components/ingredient-details/index.tsx
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { fetchIngredients } from '../../features/ingredients/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector((s) => s.ingredients);

  useEffect(() => {
    if (!items.length) dispatch(fetchIngredients());
  }, [dispatch, items.length]);

  // нет id в URL
  if (!id) return <div style={{ padding: 16 }}>Ингредиент не найден</div>;

  // ещё грузимся или список пуст — ждём
  if (loading || !items.length) return <Preloader />;

  // ошибка загрузки ингредиентов
  if (error)
    return <div style={{ padding: 16 }}>Не удалось загрузить ингредиенты</div>;

  // к этому моменту items есть — можем искать
  const ingredientData = items.find((i) => i._id === id);

  if (!ingredientData)
    return <div style={{ padding: 16 }}>Ингредиент не найден</div>;

  // здесь TS уже знает, что ingredientData: TIngredient
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
