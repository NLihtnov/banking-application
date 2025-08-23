import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserDTO } from '../domain/entities/types';
import type { LoginCredentials, RegisterData } from '../application/usecases/AuthenticationUseCase';
import { DependencyContainer } from '../infrastructure/container/DependencyContainer';

interface AuthState {
  user: UserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authUseCase = DependencyContainer.getInstance().getAuthenticationUseCase();

const convertUserToDTO = (user: any): UserDTO => ({
  id: user.id || user._id,
  name: user.name || user._name,
  email: user.email || user._email,
  balance: user.balance || user._balance
});

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const result = await authUseCase.login(credentials);
    localStorage.setItem('token', result.token);
    return {
      user: convertUserToDTO(result.user),
      token: result.token
    };
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData) => {
    const result = await authUseCase.register(data);
    localStorage.setItem('token', result.token);
    return {
      user: convertUserToDTO(result.user),
      token: result.token
    };
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }
    const user = await authUseCase.getCurrentUser(token);
    return convertUserToDTO(user);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.balance = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro no login';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro no registro';
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, clearError, updateBalance } = authSlice.actions;
export default authSlice.reducer;
