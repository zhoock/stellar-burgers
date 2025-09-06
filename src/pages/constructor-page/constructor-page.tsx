// src/pages/constructor/ConstructorPage.tsx
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import {
  fetchIngredients,
  selectAllIngredients,
  selectIngredientsLoading
} from '../../features/ingredients/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectAllIngredients);
  const loading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    if (!items.length) dispatch(fetchIngredients());
  }, [dispatch, items.length]);

  return loading ? (
    <Preloader />
  ) : (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
