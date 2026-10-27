import { apiSlice } from './apiSlice';
import { Team, ApiResponse } from '@/types';

export interface PlayerSearchResult {
  id: string;
  name: string;
  email: string;
  playerKey?: string | null;
  playerProfile?: {
    battingStyle?: string | null;
    bowlingStyle?: string | null;
  } | null;
}

export interface CreateTeamPayload {
  name: string;
  playerIds?: string[];
}

export const teamsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchPlayers: builder.query<PlayerSearchResult[], string>({
      query: (query) => `/teams/search-players?q=${encodeURIComponent(query)}`,
      transformResponse: (response: ApiResponse<PlayerSearchResult[]> | PlayerSearchResult[]) => {
        if ('data' in response && Array.isArray(response.data)) {
          return response.data;
        }
        return Array.isArray(response) ? response : [];
      },
    }),

    createTeam: builder.mutation<Team, CreateTeamPayload>({
      query: (body) => ({
        url: '/teams',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<Team> | Team) => {
        if ('data' in response && response.data) {
          return response.data;
        }
        return response as Team;
      },
      invalidatesTags: ['Team'],
    }),

    getTeamById: builder.query<Team, string>({
      query: (id) => `/teams/${id}`,
      transformResponse: (response: ApiResponse<Team> | Team) => {
        if ('data' in response && response.data) {
          return response.data;
        }
        return response as Team;
      },
      providesTags: (_result, _error, id) => [{ type: 'Team', id }],
    }),

    getMyTeams: builder.query<Team[], void>({
      query: () => '/teams/my-teams',
      transformResponse: (response: ApiResponse<Team[]> | Team[]) => {
        if ('data' in response && Array.isArray(response.data)) {
          return response.data;
        }
        return Array.isArray(response) ? response : [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Team' as const, id })),
              { type: 'Team', id: 'MY_LIST' },
            ]
          : [{ type: 'Team', id: 'MY_LIST' }],
    }),

    addPlayerToTeam: builder.mutation<Team, { teamId: string; playerId: string }>({
      query: ({ teamId, playerId }) => ({
        url: `/teams/${teamId}/players`,
        method: 'POST',
        body: { playerId },
      }),
      invalidatesTags: (_result, _error, { teamId }) => [
        { type: 'Team', id: teamId },
        { type: 'Team', id: 'MY_LIST' },
      ],
    }),

    removePlayerFromTeam: builder.mutation<{ message: string }, { teamId: string; playerId: string }>({
      query: ({ teamId, playerId }) => ({
        url: `/teams/${teamId}/players/${playerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { teamId }) => [
        { type: 'Team', id: teamId },
        { type: 'Team', id: 'MY_LIST' },
      ],
    }),

    respondTeamInvite: builder.mutation<
      { message: string; status: string },
      { teamId: string; action: 'ACCEPT' | 'REJECT' }
    >({
      query: ({ teamId, action }) => ({
        url: `/teams/${teamId}/respond-invite`,
        method: 'POST',
        body: { action },
      }),
      invalidatesTags: ['Team'],
    }),
  }),
});

export const {
  useSearchPlayersQuery,
  useLazySearchPlayersQuery,
  useCreateTeamMutation,
  useGetTeamByIdQuery,
  useGetMyTeamsQuery,
  useAddPlayerToTeamMutation,
  useRemovePlayerFromTeamMutation,
  useRespondTeamInviteMutation,
} = teamsApi;

