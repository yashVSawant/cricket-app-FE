import { apiSlice } from './apiSlice';
import { Tournament, ApiResponse } from '@/types';

export interface CreateTournamentPayload {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  format: string;
  oversPerInnings: number;
  description?: string;
}

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

    getMyTournaments: builder.query<Tournament[], void>({
      query: () => '/tournaments/my-tournaments',
      transformResponse: (response: ApiResponse<Tournament[]> | Tournament[]) => {
        if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
          return response.data;
        }
        return Array.isArray(response) ? response : [];
      },
      providesTags: [{ type: 'Tournament', id: 'MY_LIST' }],
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

    createTournament: builder.mutation<Tournament, CreateTournamentPayload>({
      query: (body) => ({
        url: '/tournaments',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<Tournament> | Tournament) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data;
        }
        return response as Tournament;
      },
      invalidatesTags: [
        { type: 'Tournament', id: 'LIST' },
        { type: 'Tournament', id: 'MY_LIST' },
      ],
    }),

    registerTeamToTournament: builder.mutation<
      any,
      { tournamentId: string; teamKey: string }
    >({
      query: ({ tournamentId, teamKey }) => ({
        url: `/tournaments/${tournamentId}/register-team`,
        method: 'POST',
        body: { teamKey },
      }),
      invalidatesTags: (_res, _err, { tournamentId }) => [
        { type: 'Tournament', id: tournamentId },
        { type: 'Tournament', id: 'MY_LIST' },
      ],
    }),
  }),
});

export const {
  useGetTournamentsQuery,
  useGetMyTournamentsQuery,
  useGetTournamentByIdQuery,
  useCreateTournamentMutation,
  useRegisterTeamToTournamentMutation,
} = tournamentsApi;
