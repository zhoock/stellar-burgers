// src/components/ingredients-category/index.tsx
import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import type { RootState } from '../../services/store';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: picked = [] } = useSelector(
    (s: RootState) => s.burgerConstructor
  );

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};
    picked.forEach((i: TIngredient) => {
      counters[i._id] = (counters[i._id] || 0) + 1;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [bun, picked]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
