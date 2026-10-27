import { apiSlice } from './apiSlice';
import { Match, ApiResponse } from '@/types';

export const matchesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMatches: builder.query<Match[], { status?: string; tournamentId?: string } | void>({
      query: (params) => ({
        url: '/matches',
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<Match[]> | Match[]) => {
        if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
          return response.data;
        }
        return Array.isArray(response) ? response : [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Match' as const, id })),
              { type: 'Match', id: 'LIST' },
            ]
          : [{ type: 'Match', id: 'LIST' }],
    }),
    getLiveMatches: builder.query<Match[], void>({
      query: () => ({
        url: '/matches',
        params: { status: 'LIVE' },
      }),
      transformResponse: (response: ApiResponse<Match[]> | Match[]) => {
        if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
          return response.data;
        }
        return Array.isArray(response) ? response : [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Match' as const, id })),
              { type: 'Match', id: 'LIVE_LIST' },
            ]
          : [{ type: 'Match', id: 'LIVE_LIST' }],
    }),
    getMatchById: builder.query<Match, string>({
      query: (id) => `/matches/${id}`,
      transformResponse: (response: ApiResponse<Match> | Match) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data;
        }
        return response as Match;
      },
      providesTags: (_result, _error, id) => [{ type: 'Match', id }],
    }),
  }),
});

export const {
  useGetMatchesQuery,
  useGetLiveMatchesQuery,
  useGetMatchByIdQuery,
} = matchesApi;

