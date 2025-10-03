// src/pages/register/register.tsx

import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { registerThunk } from '../../features/user/userSlice';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector((s) => s.user.isLoading);
  const sliceError = useSelector((s) => s.user.error);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string>('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      await dispatch(
        registerThunk({ name: userName, email, password })
      ).unwrap();
      // после успешной регистрации пользователь уже авторизован — ведём на главную
      navigate('/', { replace: true });
    } catch (err: any) {
      setLocalError(err?.message || 'Не удалось зарегистрироваться');
    }
  };

  return (
    <RegisterUI
      errorText={localError || sliceError || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
