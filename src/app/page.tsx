'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trophy,
  Radio,
  Users,
  Shield,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ScoreCard } from '@/components/domain/ScoreCard';
import { TournamentCard } from '@/components/domain/TournamentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useGetLiveMatchesQuery } from '@/services/api/matchesApi';
import { useGetTournamentsQuery } from '@/services/api/tournamentsApi';

export default function HomePage() {
  const { data: liveMatches = [], isLoading: isLiveLoading } = useGetLiveMatchesQuery();
  const { data: tournaments = [], isLoading: isTournamentsLoading } = useGetTournamentsQuery({ limit: 6 });

  return (
    <PageLayout maxWidth="7xl">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white p-8 sm:p-12 mb-12 shadow-xl border border-primary-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-800/80 border border-primary-700/60 text-xs font-semibold text-primary-200 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-secondary-400" />
            <span>Cricket Tournament Platform v1.0</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 text-white">
            Manage Tournaments.
            <br />
            Score Live. <span className="text-secondary-400">Broadcast Instant.</span>
          </h1>

          <p className="text-base sm:text-lg text-primary-100 max-w-2xl mb-8 leading-relaxed font-normal">
            A production-grade cricket engine supporting organizer verification,
            strict team roster integrity (max 6 teams, 1 per tournament), ball-by-ball
            real-time scoring with undo, and automated career leaderboards.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/tournaments">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Browse Tournaments
              </Button>
            </Link>
            <Link href="/teams/create">
              <Button
                variant="outline"
                size="lg"
                className="bg-primary-800/60 text-white border-primary-700/80 hover:bg-primary-800 hover:text-white"
              >
                Create Team
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-12 pt-8 border-t border-primary-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-primary-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary-400 shrink-0" />
            <span>6-Team Player Cap</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary-400 shrink-0" />
            <span>1 Tournament / Player</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary-400 shrink-0" />
            <span>Ball-by-Ball + Undo</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary-400 shrink-0" />
            <span>Redis Cache & BullMQ</span>
          </div>
        </div>
      </section>

      {/* Live Match Center */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Live Match Center</h2>
            <Badge variant="live" size="sm">LIVE</Badge>
          </div>
          <Link href="/live">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Matches
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isLiveLoading ? (
              <Card className="p-6">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-10 w-1/2 mb-3" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ) : liveMatches.length > 0 ? (
              <div className="space-y-4">
                {liveMatches.slice(0, 2).map((match) => (
                  <ScoreCard key={match.id} match={match} className="border-secondary-200 shadow-md" />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center flex flex-col items-center justify-center border-border bg-surface h-full min-h-[220px]">
                <div className="w-12 h-12 rounded-2xl bg-secondary-50 text-secondary-600 flex items-center justify-center mb-3">
                  <Radio className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  No Live Matches In Progress
                </h3>
                <p className="text-xs text-muted max-w-md mb-5 leading-relaxed">
                  When tournament matches begin, ball-by-ball scorecards, run rates, and live delivery commentary stream here in real-time.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/tournaments">
                    <Button variant="secondary" size="sm">
                      Browse Tournaments
                    </Button>
                  </Link>
                  <Link href="/live">
                    <Button variant="outline" size="sm">
                      View Match Schedules
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>

          <Card className="p-5 flex flex-col justify-between bg-primary-900 text-white border-primary-800">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary-200 uppercase tracking-wider">
                  Realtime Engine
                </span>
                <Radio className="w-4 h-4 text-secondary-400 animate-pulse" />
              </div>
              <h3 className="mt-3 text-lg font-bold">Socket.IO Broadcast</h3>
              <p className="mt-2 text-xs text-primary-100 leading-relaxed">
                Ball-by-ball delivery events stream instantly into the room{' '}
                <code className="bg-primary-800 px-1.5 py-0.5 rounded text-secondary-300">
                  match:id
                </code>{' '}
                with transactional integrity and undo support.
              </p>
            </div>

            <div className="mt-6">
              <Link href="/live">
                <Button variant="secondary" size="sm" fullWidth>
                  Explore Live Center
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Featured Tournaments</h2>
            <p className="text-xs text-muted">
              Browse approved tournaments hosted by verified organizers.
            </p>
          </div>
          <Link href="/tournaments">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Tournaments
            </Button>
          </Link>
        </div>

        {isTournamentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={`tourn-skel-${i}`} className="p-5">
                <Skeleton className="h-5 w-2/3 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-full mt-4" />
              </Card>
            ))}
          </div>
        ) : tournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tourn) => (
              <TournamentCard key={tourn.id} tournament={tourn} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Trophy className="w-6 h-6 text-primary-500" />}
            title="No Tournaments Scheduled Yet"
            description="Upcoming leagues and tournaments hosted by verified organizers will be listed here with team registrations and schedules."
            action={
              <Link href="/tournaments">
                <Button variant="primary" size="sm">
                  Explore Tournaments
                </Button>
              </Link>
            }
          />
        )}
      </section>

      {/* Architecture & Role Pillars */}
      <section className="mb-12">
        <Card className="p-8 bg-surface border border-border shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Role-Based System Flow</h2>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Engineered with strict security boundaries, audit notes, and transactional checks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-surface-muted border border-border flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">1. Players</h4>
              <p className="text-xs text-muted mt-1">
                Direct self-registration. Create teams with unique keys. Enforced max 6 teams.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-muted border border-border flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-700 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">2. Super Admin</h4>
              <p className="text-xs text-muted mt-1">
                Reviews organizer requests. Approves/rejects with audit notes and invites admin users.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-muted border border-border flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">3. Organizers</h4>
              <p className="text-xs text-muted mt-1">
                Create tournaments, register teams via team keys, schedule fixtures, and assign scorers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-muted border border-border flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-700 flex items-center justify-center mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">4. Scorers</h4>
              <p className="text-xs text-muted mt-1">
                Ball-by-ball delivery entry console. Strike rotation, boundaries, wickets, and undo last ball.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </PageLayout>
  );
}
