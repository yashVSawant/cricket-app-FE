'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Calendar, ArrowRight, Trophy } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ScoreCard } from '@/components/domain/ScoreCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useGetMatchesQuery } from '@/services/api/matchesApi';

export default function LiveMatchesDirectoryPage() {
  const { data: matches = [], isLoading } = useGetMatchesQuery();

  const liveMatches = matches.filter((m) => m.status === 'LIVE');
  const upcomingMatches = matches.filter((m) => m.status === 'SCHEDULED');
  const completedMatches = matches.filter((m) => m.status === 'COMPLETED');

  return (
    <PageLayout maxWidth="7xl" className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-50 border border-secondary-200 text-xs font-semibold text-secondary-700 mb-2">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Real-time Match Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Live Matches & Scorecards
        </h1>
        <p className="text-sm text-muted mt-1">
          Instant live ball-by-ball commentary, scores, and schedules open to everyone without sign-in.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={`match-skel-${i}`} className="p-5">
              <Skeleton className="h-5 w-1/3 mb-4" />
              <Skeleton className="h-8 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon={<Radio className="w-8 h-8 text-secondary" />}
          title="No Matches Scheduled Yet"
          description="Tournament matches scheduled by organizers will appear here in real-time."
          action={
            <Link href="/tournaments">
              <Button variant="secondary" size="sm">
                Explore Tournaments
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-10">
          {/* Section 1: LIVE Matches */}
          {liveMatches.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="live" size="sm">LIVE NOW</Badge>
                <h2 className="text-lg font-bold text-gray-900">In Progress</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveMatches.map((m) => (
                  <div key={m.id} className="relative group">
                    <ScoreCard match={m} className="border-secondary-300 shadow-md" />
                    <div className="mt-2 text-right">
                      <Link href={`/scoring/${m.id}`}>
                        <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                          Open Match Feed
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 2: Scheduled Matches */}
          {upcomingMatches.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-gray-900">Upcoming Fixtures</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingMatches.map((m) => (
                  <ScoreCard key={m.id} match={m} />
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Completed Matches */}
          {completedMatches.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Results</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedMatches.map((m) => (
                  <ScoreCard key={m.id} match={m} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PageLayout>
  );
}

