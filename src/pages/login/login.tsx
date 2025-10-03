// src/pages/login/Login.tsx
import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { loginThunk } from '../../features/user/userSlice';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = useSelector((s) => s.user.isLoading);
  const sliceError = useSelector((s) => s.user.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string>('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      await dispatch(loginThunk({ email, password })).unwrap();
      // вернуться туда, куда пользователь хотел попасть
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setLocalError(err?.message || 'Не удалось войти');
    }
  };

  return (
    <LoginUI
      errorText={localError || sliceError || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
