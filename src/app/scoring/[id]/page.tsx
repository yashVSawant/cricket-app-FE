'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Radio,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Flame,
  Shield,
  Activity,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { useGetMatchByIdQuery } from '@/services/api/matchesApi';
import {
  usePostDeliveryMutation,
  useUndoDeliveryMutation,
  PostDeliveryPayload,
} from '@/services/api/scoringApi';
import { useLiveMatch } from '@/hooks/useLiveMatch';

export default function ScoringConsolePage() {
  const params = useParams();
  const matchId = params?.id as string;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: initialMatch, isLoading } = useGetMatchByIdQuery(matchId, {
    skip: !matchId,
  });

  // Real-time live Socket.IO connection
  const { match: liveMatch, isConnected } = useLiveMatch(matchId, initialMatch || null);
  const match = liveMatch || initialMatch;

  const [postDeliveryMutation, { isLoading: isPosting }] = usePostDeliveryMutation();
  const [undoDeliveryMutation, { isLoading: isUndoing }] = useUndoDeliveryMutation();

  // Scorer active selection state
  const [selectedExtra, setSelectedExtra] = useState<'NONE' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE'>('NONE');
  const [isWicketSelected, setIsWicketSelected] = useState(false);
  const [wicketType, setWicketType] = useState<'BOWLED' | 'CAUGHT' | 'LBW' | 'RUN_OUT' | 'STUMPED' | 'HIT_WICKET'>('BOWLED');

  const currentInnings = match?.innings && match.innings.length > 0
    ? match.innings[match.innings.length - 1]
    : null;

  const battingTeamName = currentInnings?.battingTeamId === match?.teamAId
    ? match?.teamAName
    : match?.teamBName;

  const bowlingTeamName = currentInnings?.bowlingTeamId === match?.teamAId
    ? match?.teamAName
    : match?.teamBName;

  const handleDeliverySubmit = async (runsOffBat: number, isFour = false, isSix = false) => {
    if (!matchId) return;

    let extraRuns = 0;
    if (selectedExtra === 'WIDE' || selectedExtra === 'NO_BALL') {
      extraRuns = 1;
    }

    const payload: PostDeliveryPayload = {
      runsOffBat,
      extraType: selectedExtra,
      extraRuns,
      isFour: isFour || runsOffBat === 4,
      isSix: isSix || runsOffBat === 6,
      wicketType: isWicketSelected ? wicketType : undefined,
    };

    try {
      await postDeliveryMutation({ matchId, payload }).unwrap();
      toast.success(
        isWicketSelected
          ? `WICKET! (${wicketType}) + ${runsOffBat + extraRuns} runs`
          : `+${runsOffBat + extraRuns} runs recorded & broadcasted`,
        'Ball Recorded',
      );

      // Reset modifiers
      setSelectedExtra('NONE');
      setIsWicketSelected(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to record ball delivery.', 'Scoring Error');
    }
  };

  const handleUndo = async () => {
    if (!matchId) return;
    try {
      await undoDeliveryMutation({ matchId }).unwrap();
      toast.info('Last ball delivery undone and reversed on scoreboard.', 'Delivery Undone');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to undo delivery.', 'Undo Error');
    }
  };

  if (isLoading || !match) {
    return (
      <PageLayout maxWidth="2xl" className="py-8">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-56 w-full mb-6" />
        <Skeleton className="h-72 w-full" />
      </PageLayout>
    );
  }

  // Format overs helper
  const balls = currentInnings?.balls || 0;
  const oversCompleted = Math.floor(balls / 6);
  const ballsInCurrentOver = balls % 6;
  const currentOverFormatted = `${oversCompleted}.${ballsInCurrentOver}`;
  const runRate = balls > 0 ? ((currentInnings?.runs || 0) / (balls / 6)).toFixed(2) : '0.00';

  return (
    <PageLayout maxWidth="2xl" className="py-8">
      {/* Realtime Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="live" size="sm">LIVE MATCH SCORER</Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isConnected ? 'Socket Broadcast Connected' : 'Connecting WebSocket...'}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            {match.teamAName} vs {match.teamBName}
          </h1>
          <p className="text-xs text-muted">
            {match.tournament?.name} • {match.venue}
          </p>
        </div>

        {/* Undo Delivery Button */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            isLoading={isUndoing}
            leftIcon={<RotateCcw className="w-4 h-4 text-red-600" />}
            className="border-red-200 hover:bg-red-50 text-red-700"
          >
            Undo Last Ball
          </Button>
        </div>
      </div>

      {/* Main Scoreboard Display */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white border-primary-800 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-secondary-400 uppercase tracking-wider">
              Innings {currentInnings?.number || 1} • {battingTeamName} Batting
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-6xl font-black tracking-tight">
                {currentInnings?.runs || 0}/{currentInnings?.wickets || 0}
              </span>
              <span className="text-sm sm:text-lg text-primary-200 font-medium">
                ({currentOverFormatted} / {match.tournament?.oversPerInnings || 20} Ov)
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-primary-200">
              <span>Run Rate: <strong className="text-white">{runRate}</strong></span>
              <span>Bowling: <strong className="text-white">{bowlingTeamName}</strong></span>
            </div>
          </div>

          {/* Match Result Banner if Completed */}
          {match.status === 'COMPLETED' && (
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center">
              <span className="text-xs font-bold text-secondary-400 uppercase">Match Concluded</span>
              <p className="text-base font-extrabold mt-1">{match.result}</p>
            </div>
          )}
        </div>
      </Card>

      {/* SCORER KEYPAD CONSOLE */}
      {match.status === 'LIVE' ? (
        <div className="space-y-6">
          {/* Extras and Wicket Modifiers Bar */}
          <Card className="p-4 border-border bg-surface shadow-sm">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Ball Modifiers (Select before pressing runs)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {/* Extra Type Buttons */}
              {(['NONE', 'WIDE', 'NO_BALL', 'BYE', 'LEG_BYE'] as const).map((ext) => (
                <button
                  key={ext}
                  type="button"
                  onClick={() => setSelectedExtra(ext)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedExtra === ext
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-surface-muted text-gray-700 hover:bg-gray-200 border border-border'
                  }`}
                >
                  {ext === 'NONE' ? 'Standard Ball' : ext.replace('_', ' ')}
                </button>
              ))}

              {/* Wicket Toggle Button */}
              <button
                type="button"
                onClick={() => setIsWicketSelected(!isWicketSelected)}
                className={`ml-auto px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all cursor-pointer ${
                  isWicketSelected
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                }`}
              >
                {isWicketSelected ? 'WICKET MARKED' : 'Mark Wicket'}
              </button>
            </div>

            {/* Wicket Type Dropdown (If wicket marked) */}
            {isWicketSelected && (
              <div className="mt-3 pt-3 border-t border-border flex items-center gap-3">
                <span className="text-xs font-semibold text-red-700">Dismissal Kind:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['BOWLED', 'CAUGHT', 'LBW', 'RUN_OUT', 'STUMPED', 'HIT_WICKET'] as const).map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => setWicketType(kind)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                        wicketType === kind
                          ? 'bg-red-700 text-white'
                          : 'bg-red-100/60 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {kind.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Runs Scored Keypad */}
          <Card className="p-6 border-border bg-surface shadow-sm">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 text-center">
              Tap Run Button to Record Delivery
            </span>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {/* Dot Ball (0) */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleDeliverySubmit(0)}
                disabled={isPosting}
                className="h-16 text-xl font-black bg-surface-muted border-border hover:bg-gray-100 text-gray-900"
              >
                0 (Dot)
              </Button>

              {/* 1 Run */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleDeliverySubmit(1)}
                disabled={isPosting}
                className="h-16 text-xl font-black bg-surface border-border hover:bg-primary-50 text-primary-900"
              >
                1
              </Button>

              {/* 2 Runs */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleDeliverySubmit(2)}
                disabled={isPosting}
                className="h-16 text-xl font-black bg-surface border-border hover:bg-primary-50 text-primary-900"
              >
                2
              </Button>

              {/* 3 Runs */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleDeliverySubmit(3)}
                disabled={isPosting}
                className="h-16 text-xl font-black bg-surface border-border hover:bg-primary-50 text-primary-900"
              >
                3
              </Button>

              {/* 4 BOUNDARY */}
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleDeliverySubmit(4, true)}
                disabled={isPosting}
                className="h-16 text-2xl font-black shadow-md bg-secondary hover:bg-secondary-600 text-white"
              >
                4 (Four)
              </Button>

              {/* 6 MAXIMUM */}
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleDeliverySubmit(6, false, true)}
                disabled={isPosting}
                className="h-16 text-2xl font-black shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                6 (Six)
              </Button>
            </div>
          </Card>

          {/* Recent Deliveries Feed */}
          <Card className="p-5 border-border bg-surface shadow-sm">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Recent Deliveries (This Innings)
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {currentInnings?.deliveries && currentInnings.deliveries.length > 0 ? (
                currentInnings.deliveries.slice(0, 18).map((del) => {
                  const isW = !!del.wicketType;
                  const isBoundary = del.isFour || del.isSix;

                  return (
                    <div
                      key={del.id}
                      className={`w-10 h-10 rounded-full flex flex-col items-center justify-center font-bold text-xs shrink-0 border ${
                        isW
                          ? 'bg-red-600 text-white border-red-700 shadow-sm'
                          : del.isSix
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                          : del.isFour
                          ? 'bg-secondary text-white border-secondary-600 shadow-sm'
                          : del.extraType !== 'NONE'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-surface-muted text-gray-800 border-border'
                      }`}
                      title={`Over ${del.over}.${del.ballInOver} - ${del.runsOffBat} runs (${del.extraType})`}
                    >
                      <span>
                        {isW ? 'W' : del.runsOffBat + (del.extraRuns || 0)}
                      </span>
                      {del.extraType !== 'NONE' && (
                        <span className="text-[8px] uppercase leading-none">
                          {del.extraType[0]}
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-muted">No balls delivered yet in this innings.</p>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-8 text-center border-border bg-surface">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-900">Match Completed</h3>
          <p className="text-xs text-muted mt-1">{match.result}</p>
        </Card>
      )}
    </PageLayout>
  );
}
