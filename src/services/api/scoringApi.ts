import { apiSlice } from './apiSlice';
import { Match, Delivery, ApiResponse } from '@/types';

export interface PostDeliveryPayload {
  runsOffBat: number;
  extraType?: 'NONE' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE';
  extraRuns?: number;
  isFour?: boolean;
  isSix?: boolean;
  wicketType?: 'BOWLED' | 'CAUGHT' | 'LBW' | 'RUN_OUT' | 'STUMPED' | 'HIT_WICKET';
  dismissedId?: string;
  strikerId?: string;
  nonStrikerId?: string;
  bowlerId?: string;
}

export const scoringApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postDelivery: builder.mutation<
      { match: Match; delivery: Delivery },
      { matchId: string; payload: PostDeliveryPayload }
    >({
      query: ({ matchId, payload }) => ({
        url: `/scoring/${matchId}/delivery`,
        method: 'POST',
        body: payload,
      }),
      transformResponse: (
        response:
          | ApiResponse<{ match: Match; delivery: Delivery }>
          | { match: Match; delivery: Delivery },
      ) => {
        if ('data' in response && response.data) {
          return response.data;
        }
        return response as { match: Match; delivery: Delivery };
      },
      invalidatesTags: (_res, _err, { matchId }) => [
        { type: 'Match', id: matchId },
        { type: 'Match', id: 'LIVE_LIST' },
      ],
    }),

    undoDelivery: builder.mutation<
      { message: string; match: Match },
      { matchId: string }
    >({
      query: ({ matchId }) => ({
        url: `/scoring/${matchId}/undo`,
        method: 'POST',
      }),
      transformResponse: (
        response:
          | ApiResponse<{ message: string; match: Match }>
          | { message: string; match: Match },
      ) => {
        if ('data' in response && response.data) {
          return response.data;
        }
        return response as { message: string; match: Match };
      },
      invalidatesTags: (_res, _err, { matchId }) => [
        { type: 'Match', id: matchId },
        { type: 'Match', id: 'LIVE_LIST' },
      ],
    }),
  }),
});

export const { usePostDeliveryMutation, useUndoDeliveryMutation } = scoringApi;

