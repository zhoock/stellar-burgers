// src/components/BurgerIngredient/index.tsx
import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { addItem } from '../../features/constructor/constructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    // const handleAdd = () => {
    //   dispatch(addItem(ingredient));
    // };

    const handleAdd = (e?: MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      dispatch(addItem(ingredient));
      // console.log('added', ingredient._id); // временно для проверки
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }} // клик по карточке → модалка
        handleAdd={handleAdd} // клик по кнопке → добавить
      />
    );
  }
);
