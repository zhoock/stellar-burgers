import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../../services/store'; // поправь путь, если у тебя другой

type ProtectedRouteProps = {
  children: React.ReactElement;
  /** true => маршрут только для НЕавторизованных (гости).
   *  false/undefined => маршрут только для авторизованных. */
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth
}) => {
  const { user, isInit, isLoading } = useSelector((s: RootState) => s.user);
  const location = useLocation();

  // Пока идёт инициализация/загрузка — можно показать прелоадер или вернуть null
  if (!isInit || isLoading) {
    return null;
  }

  // Роуты только для гостей (login/register/forgot/reset)
  if (onlyUnAuth) {
    return user ? <Navigate to='/' replace /> : children;
  }

  // Приватные роуты (profile/profile/orders/модалки профиля)
  return user ? (
    children
  ) : (
    <Navigate to='/login' replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
