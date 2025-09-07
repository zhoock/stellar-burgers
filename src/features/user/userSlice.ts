import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  type TRegisterData,
  type TLoginData
} from '../../utils/burger-api';
import { setCookie } from '../../utils/cookie';
import type { TUser } from '../../utils/types';

export interface UserState {
  isInit: boolean; // мы попробовали определить пользователя
  isLoading: boolean; // любая активная операция (логин/гет/апдейт/логаут)
  user: TUser | null;
  error: string | null;
}

const initialState: UserState = {
  isInit: false,
  isLoading: false,
  user: null,
  error: null
};

// ---------- THUNKS ----------

// регистрация → сохраняем токены → возвращаем user
export const registerThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data); // {success, accessToken, refreshToken, user}
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user as TUser;
  }
);

// логин → сохраняем токены → возвращаем user
export const loginThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data); // {success, accessToken, refreshToken, user}
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user as TUser;
  }
);

// получить пользователя по accessToken (fetchWithRefresh сам обновит токен при необходимости)
export const getUserThunk = createAsyncThunk('user/get', async () => {
  const res = await getUserApi(); // {success, user}
  return res.user as TUser;
});

// обновить профиль
export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data); // {success, user}
    return res.user as TUser;
  }
);

// логаут → чистим токены
export const logoutThunk = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  // "очистить" accessToken (если у setCookie есть опции expires — лучше выставить просрочку)
  setCookie('accessToken', '', { expires: -1 });
});

// ---------- SLICE ----------

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // помечаем, что попытка инициализации была (нужно, если getUserThunk упал/пропущен)
    initDone: (state) => {
      state.isInit = true;
    }
  },
  extraReducers: (builder) => {
    // register
    builder.addCase(registerThunk.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    builder.addCase(registerThunk.rejected, (s, a) => {
      s.isLoading = false;
      s.error = String(a.error.message || 'Ошибка регистрации');
    });
    builder.addCase(registerThunk.fulfilled, (s, { payload }) => {
      s.isLoading = false;
      s.isInit = true;
      s.user = payload;
    });

    // login
    builder.addCase(loginThunk.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    builder.addCase(loginThunk.rejected, (s, a) => {
      s.isLoading = false;
      s.error = String(a.error.message || 'Ошибка входа');
    });
    builder.addCase(loginThunk.fulfilled, (s, { payload }) => {
      s.isLoading = false;
      s.isInit = true;
      s.user = payload;
    });

    // get user
    builder.addCase(getUserThunk.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    builder.addCase(getUserThunk.rejected, (s, a) => {
      s.isLoading = false;
      s.isInit = true;
      s.user = null;
      s.error = String(a.error.message || 'Не авторизован');
    });
    builder.addCase(getUserThunk.fulfilled, (s, { payload }) => {
      s.isLoading = false;
      s.isInit = true;
      s.user = payload;
    });

    // update
    builder.addCase(updateUserThunk.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    builder.addCase(updateUserThunk.rejected, (s, a) => {
      s.isLoading = false;
      s.error = String(a.error.message || 'Ошибка обновления');
    });
    builder.addCase(updateUserThunk.fulfilled, (s, { payload }) => {
      s.isLoading = false;
      s.user = payload;
    });

    // logout
    builder.addCase(logoutThunk.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    builder.addCase(logoutThunk.rejected, (s, a) => {
      s.isLoading = false;
      s.error = String(a.error.message || 'Ошибка выхода');
    });
    builder.addCase(logoutThunk.fulfilled, (s) => {
      s.isLoading = false;
      s.isInit = true;
      s.user = null;
    });
  }
});

export const { initDone } = userSlice.actions;
export default userSlice.reducer;

// селекторы, удобно использовать в ProtectedRoute и формах
export const selectUser = (s: { user: UserState }) => s.user.user;
export const selectIsInit = (s: { user: UserState }) => s.user.isInit;
export const selectIsLoading = (s: { user: UserState }) => s.user.isLoading;
export const selectIsAuth = (s: { user: UserState }) => Boolean(s.user.user);
