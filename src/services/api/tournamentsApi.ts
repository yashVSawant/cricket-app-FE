import { apiSlice } from './apiSlice';
import { Tournament, ApiResponse } from '@/types';

export const tournamentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTournaments: builder.query<Tournament[], { status?: string; limit?: number } | void>({
      query: (params) => ({
        url: '/tournaments',
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<Tournament[]> | Tournament[]) => {
        if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
          return response.data;
        }
        return Array.isArray(response) ? response : [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Tournament' as const, id })),
              { type: 'Tournament', id: 'LIST' },
            ]
          : [{ type: 'Tournament', id: 'LIST' }],
    }),
    getTournamentById: builder.query<Tournament, string>({
      query: (id) => `/tournaments/${id}`,
      transformResponse: (response: ApiResponse<Tournament> | Tournament) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data;
        }
        return response as Tournament;
      },
      providesTags: (_result, _error, id) => [{ type: 'Tournament', id }],
    }),
  }),
});

export const { useGetTournamentsQuery, useGetTournamentByIdQuery } = tournamentsApi;

