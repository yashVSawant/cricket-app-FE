import { apiSlice } from './apiSlice';
import { User, ApiResponse } from '@/types';
import { setCredentials, logout } from '@/store/slices/authSlice';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'PLAYER' | 'ADMIN';
  battingStyle?: string;
  bowlingStyle?: string;
  organizationName?: string;
  phone?: string;
  organizationDescription?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponseData, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ApiResponse<AuthResponseData> | AuthResponseData) => {
        if ('data' in response && response.data) {
          return response.data;
        }
        return response as AuthResponseData;
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
        } catch {
          // ignore error here, handled in UI
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),

    login: builder.mutation<AuthResponseData, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ApiResponse<AuthResponseData> | AuthResponseData) => {
        if ('data' in response && response.data) {
          return response.data;
        }
        return response as AuthResponseData;
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
        } catch {
          // ignore error here, handled in UI
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),

    logoutUser: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),

    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (response: ApiResponse<User> | User) => {
        if ('data' in response && response.data) {
          return response.data;
        }
        return response as User;
      },
      providesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutUserMutation,
  useGetMeQuery,
} = authApi;

