'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Play,
  Plus,
  Radio,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ScoreCard } from '@/components/domain/ScoreCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import {
  useGetTournamentByIdQuery,
  useRegisterTeamToTournamentMutation,
} from '@/services/api/tournamentsApi';
import {
  useCreateMatchMutation,
  useStartMatchMutation,
} from '@/services/api/matchesApi';

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params?.id as string;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: tournament, isLoading, error } = useGetTournamentByIdQuery(tournamentId, {
    skip: !tournamentId,
  });

  const [registerTeamMutation, { isLoading: isRegistering }] = useRegisterTeamToTournamentMutation();
  const [createMatchMutation, { isLoading: isCreatingMatch }] = useCreateMatchMutation();
  const [startMatchMutation, { isLoading: isStartingMatch }] = useStartMatchMutation();

  const [teamKeyInput, setTeamKeyInput] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    teamAId: '',
    teamBId: '',
    venue: '',
    startTime: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if tournament has reached its start date
  const isStartDateReached = tournament
    ? new Date(tournament.startDate).getTime() <= new Date().getTime()
    : false;

  const isOrganizerOrAdmin =
    isAuthenticated &&
    (user?.role === 'ADMIN' ||
      user?.role === 'SUPER_ADMIN' ||
      user?.organizerId === tournament?.organizerId);

  // Register Team via Key Handler
  const handleRegisterTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamKeyInput.trim()) return;

    try {
      await registerTeamMutation({
        tournamentId,
        teamKey: teamKeyInput.trim(),
      }).unwrap();

      toast.success('Team registered to tournament successfully!', 'Team Added');
      setTeamKeyInput('');
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.error || 'Failed to register team with provided key.',
        'Registration Failed',
      );
    }
  };

  // Schedule Match Handler
  const handleScheduleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!scheduleData.teamAId || !scheduleData.teamBId) {
      setErrorMessage('Please select both Team A and Team B.');
      return;
    }
    if (scheduleData.teamAId === scheduleData.teamBId) {
      setErrorMessage('A match cannot be scheduled between the same team.');
      return;
    }
    if (!scheduleData.startTime) {
      setErrorMessage('Please choose a match start time.');
      return;
    }

    try {
      await createMatchMutation({
        tournamentId,
        teamAId: scheduleData.teamAId,
        teamBId: scheduleData.teamBId,
        venue: scheduleData.venue || tournament?.location || 'Main Stadium',
        startTime: new Date(scheduleData.startTime).toISOString(),
      }).unwrap();

      toast.success('Match scheduled successfully!', 'Match Created');
      setShowScheduleModal(false);
      setScheduleData({ teamAId: '', teamBId: '', venue: '', startTime: '' });
    } catch (err: any) {
      setErrorMessage(err?.data?.message || err?.error || 'Failed to schedule match.');
    }
  };

  // Start Match Handler
  const handleStartMatch = async (matchId: string) => {
    try {
      await startMatchMutation({
        matchId,
        payload: {},
      }).unwrap();

      toast.success('Match has started! Redirecting to scoring console...', 'Match Started');
      router.push(`/scoring/${matchId}`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to start match.', 'Error');
    }
  };

  if (isLoading) {
    return (
      <PageLayout maxWidth="7xl" className="py-8">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-48 w-full mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </PageLayout>
    );
  }

  if (!tournament || error) {
    return (
      <PageLayout maxWidth="7xl" className="py-12">
        <EmptyState
          icon={<Trophy className="w-8 h-8 text-primary" />}
          title="Tournament Not Found"
          description="The requested tournament does not exist or has been removed."
          action={
            <Link href="/tournaments">
              <Button variant="secondary" size="sm">
                Return to Tournaments
              </Button>
            </Link>
          }
        />
      </PageLayout>
    );
  }

  const registeredTeams = tournament.registrations || [];
  const matches = tournament.matches || [];

  return (
    <PageLayout maxWidth="7xl" className="py-8">
      {/* Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white p-6 sm:p-10 mb-8 border border-primary-800 shadow-lg">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" size="sm">
              {tournament.format} • {tournament.oversPerInnings} Overs
            </Badge>
            <Badge
              variant={
                tournament.status === 'ONGOING'
                  ? 'live'
                  : tournament.status === 'COMPLETED'
                  ? 'success'
                  : 'primary'
              }
              size="sm"
            >
              {tournament.status}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            {tournament.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-primary-200 mt-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-secondary-400" />
              <span>{tournament.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-secondary-400" />
              <span>
                {new Date(tournament.startDate).toLocaleDateString()} &mdash;{' '}
                {new Date(tournament.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-secondary-400" />
              <span>{registeredTeams.length} / 6 Teams Registered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Match Fixtures & Live Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-secondary" />
              <span>Tournament Matches & Fixtures</span>
            </h2>

            {/* Schedule Match Button (Organizer only) */}
            {isOrganizerOrAdmin && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowScheduleModal(!showScheduleModal)}
                leftIcon={<Plus className="w-4 h-4" />}
                disabled={registeredTeams.length < 2}
              >
                Schedule Match
              </Button>
            )}
          </div>

          {/* Schedule Match Form Card */}
          {showScheduleModal && (
            <Card className="p-5 border-secondary-300 bg-secondary-50/20 shadow-sm animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Schedule a Match (Select 2 Registered Teams)
              </h3>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleScheduleMatch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Team A <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={scheduleData.teamAId}
                      onChange={(e) =>
                        setScheduleData((prev) => ({ ...prev, teamAId: e.target.value }))
                      }
                      options={[
                        { value: '', label: '-- Select Team A --' },
                        ...registeredTeams.map((r: any) => ({
                          value: r.teamId,
                          label: r.team?.name || r.displayName,
                        })),
                      ]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Team B <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={scheduleData.teamBId}
                      onChange={(e) =>
                        setScheduleData((prev) => ({ ...prev, teamBId: e.target.value }))
                      }
                      options={[
                        { value: '', label: '-- Select Team B --' },
                        ...registeredTeams
                          .filter((r: any) => r.teamId !== scheduleData.teamAId)
                          .map((r: any) => ({
                            value: r.teamId,
                            label: r.team?.name || r.displayName,
                          })),
                      ]}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Match Start Date & Time <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="datetime-local"
                      value={scheduleData.startTime}
                      onChange={(e) =>
                        setScheduleData((prev) => ({ ...prev, startTime: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Venue
                    </label>
                    <Input
                      value={scheduleData.venue}
                      onChange={(e) =>
                        setScheduleData((prev) => ({ ...prev, venue: e.target.value }))
                      }
                      placeholder={tournament.location}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowScheduleModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    isLoading={isCreatingMatch}
                  >
                    Confirm & Schedule
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* List of Matches */}
          {matches.length === 0 ? (
            <Card className="p-8 text-center border-border bg-surface">
              <Clock className="w-8 h-8 text-muted mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                No Matches Scheduled Yet
              </h4>
              <p className="text-xs text-muted max-w-sm mx-auto">
                {registeredTeams.length < 2
                  ? 'Register at least 2 teams to schedule tournament matches.'
                  : 'Matches scheduled by the tournament organizer will appear here.'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {matches.map((match: any) => (
                <Card key={match.id} className="p-5 border-border bg-surface">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 text-xs text-muted">
                        <span>{new Date(match.startTime).toLocaleString()}</span>
                        <span>•</span>
                        <span>{match.venue}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-gray-900">
                        {match.teamAName || 'Team A'} vs {match.teamBName || 'Team B'}
                      </h3>
                      {match.result && (
                        <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block mt-2">
                          {match.result}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={
                          match.status === 'LIVE'
                            ? 'live'
                            : match.status === 'COMPLETED'
                            ? 'success'
                            : 'default'
                        }
                        size="sm"
                      >
                        {match.status}
                      </Badge>

                      {/* Start Match Button (Only available if tournament start date is reached) */}
                      {isOrganizerOrAdmin && match.status === 'SCHEDULED' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStartMatch(match.id)}
                          leftIcon={<Play className="w-4 h-4" />}
                          isLoading={isStartingMatch}
                          title={
                            isStartDateReached
                              ? 'Start this match'
                              : 'Match can only be started from tournament start date onwards'
                          }
                          disabled={!isStartDateReached}
                        >
                          Start Match
                        </Button>
                      )}

                      {/* Open Live Score Console */}
                      {match.status === 'LIVE' && (
                        <Link href={`/scoring/${match.id}`}>
                          <Button variant="secondary" size="sm">
                            Open Scorer Feed
                          </Button>
                        </Link>
                      )}

                      {/* View Match Details */}
                      {match.status === 'COMPLETED' && (
                        <Link href={`/live/${match.id}`}>
                          <Button variant="outline" size="sm">
                            Scorecard
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Registered Teams & Add Team via Key */}
        <div className="space-y-6">
          <Card className="p-5 border-border bg-surface shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Registered Teams</span>
              </h3>
              <Badge variant="secondary" size="sm">
                {registeredTeams.length} / 6 Teams
              </Badge>
            </div>

            {/* Organizer Add Team Form */}
            {isOrganizerOrAdmin && registeredTeams.length < 6 && (
              <form onSubmit={handleRegisterTeam} className="mb-4 pt-2 border-t border-border">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Register Team via Team Key
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={teamKeyInput}
                    onChange={(e) => setTeamKeyInput(e.target.value)}
                    placeholder="Enter Team Key (e.g. TM-1A2B3C)"
                    required
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="md"
                    isLoading={isRegistering}
                    className="shrink-0"
                  >
                    Add Team
                  </Button>
                </div>
                <p className="text-[11px] text-muted mt-1.5">
                  Ask team captains for their unique Team Key generated on team creation.
                </p>
              </form>
            )}

            {/* List of Registered Teams */}
            <div className="space-y-2.5">
              {registeredTeams.length === 0 ? (
                <p className="text-xs text-muted text-center py-4">
                  No teams registered yet.
                </p>
              ) : (
                registeredTeams.map((reg: any, idx: number) => (
                  <div
                    key={reg.id}
                    className="p-3 rounded-lg border border-border bg-surface-muted flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-800 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-gray-900">
                          {reg.team?.name || reg.displayName}
                        </span>
                        <p className="text-[11px] text-muted">
                          Key: {reg.team?.teamKey}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      Approved
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Tournament Guidelines */}
          <Card className="p-5 border-border bg-surface shadow-sm text-xs text-muted space-y-2.5">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Organizer Rules</span>
            </h4>
            <p>
              &bull; Maximum <strong>6 teams</strong> can participate per tournament.
            </p>
            <p>
              &bull; Matches can only be initiated from the official tournament start date onwards ({new Date(tournament.startDate).toLocaleDateString()}).
            </p>
            <p>
              &bull; Ball-by-ball score updates are saved transactionally and broadcasted in real-time to all spectators.
            </p>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
