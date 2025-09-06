// src/components/BurgerConstructorElement/index.tsx
import { FC, memo, useCallback } from 'react';
import { useDispatch } from '../../services/store';
import {
  moveItem,
  removeItem
} from '../../features/constructor/constructorSlice';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = useCallback(() => {
      if (index >= totalItems - 1) return; // уже внизу
      dispatch(moveItem({ from: index, to: index + 1 }));
    }, [dispatch, index, totalItems]);

    const handleMoveUp = useCallback(() => {
      if (index <= 0) return; // уже вверху
      dispatch(moveItem({ from: index, to: index - 1 }));
    }, [dispatch, index]);

    const handleClose = useCallback(() => {
      // ingredient.id приходит из constructorSlice (мы добавляли nanoid при addItem)
      if (ingredient.id) {
        dispatch(removeItem(ingredient.id));
      }
    }, [dispatch, ingredient.id]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
