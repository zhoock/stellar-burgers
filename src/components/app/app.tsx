// src/app/App.tsx
import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  type Location
} from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import {
  AppHeader,
  ProtectedRoute,
  Modal,
  OrderInfo,
  IngredientDetails
} from '@components';

// типизированный диспатч из стора
import { getCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import { getUserThunk, initDone } from '../../features/user/userSlice';

const App = () => {
  const location = useLocation(); // текущий адрес и "состояние" навигации
  const navigate = useNavigate(); // программный переход по маршрутам
  const dispatch = useDispatch(); // шлём команды в Redux store

  // ИНИЦИАЛИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ ПРИ СТАРТЕ
  useEffect(() => {
    const hasAccess = getCookie('accessToken'); // кука ставится при логине/refresh
    const hasRefresh = localStorage.getItem('refreshToken'); // кладём при логине

    if (hasAccess || hasRefresh) {
      dispatch(getUserThunk())
        .unwrap()
        .catch(() => dispatch(initDone())); // токен протух → считаем init завершён
    } else {
      dispatch(initDone()); // нет токенов → гость, не дергаем /auth/user
    }
  }, [dispatch]);

  // если мы пришли по Link с state.background — рисуем модалку поверх предыдущего экрана
  const background = location.state?.background;

  const handleCloseModal = () => {
    if (background) {
      navigate(-1);
    } else {
      const p = location.pathname;
      if (p.startsWith('/profile/orders/')) {
        navigate('/profile/orders', { replace: true });
      } else if (p.startsWith('/feed/')) {
        navigate('/feed', { replace: true });
      } else if (p.startsWith('/ingredients/')) {
        navigate('/', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные страницы (если есть background — рисуем по нему) */}
      <Routes location={background || location}>
        {/* по роуту "/" показываем ConstructorPage */}
        <Route path='/' element={<ConstructorPage />} />

        {/* по роуту "/feed" показываем Feed */}
        <Route path='/feed' element={<Feed />} />

        {/* гостевые */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* приватные */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* фуллпейдж-версии динамических страниц (для прямого перехода) */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модалка поверх (активируется только если есть background) */}
      {background && (
        <Routes>
          {/* /feed/:number -> Modal(OrderInfo) */}
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />

          {/* Модалка для /ingredients/:id */}
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />

          {/* /profile/orders/:number -> защищённая модалка с OrderInfo */}
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Информация о заказе' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};
export default App;
