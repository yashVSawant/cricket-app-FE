'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  Filter,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { TournamentCard } from '@/components/domain/TournamentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useGetTournamentsQuery } from '@/services/api/tournamentsApi';
import { useAuth } from '@/hooks/useAuth';

export default function TournamentsListPage() {
  const { isAuthenticated, user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data: tournaments = [], isLoading } = useGetTournamentsQuery(
    statusFilter === 'ALL' ? undefined : { status: statusFilter },
  );

  return (
    <PageLayout maxWidth="7xl" className="py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-50 border border-secondary-200 text-xs font-semibold text-secondary-700 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Cricket Championships</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Tournaments Directory
          </h1>
          <p className="text-sm text-muted mt-1">
            Browse all upcoming, ongoing, and completed cricket tournaments. Open for everyone to view.
          </p>
        </div>

        {/* Organizer Create Tournament Button */}
        {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <Link href="/tournaments/create">
            <Button variant="secondary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Create Tournament
            </Button>
          </Link>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer ${
              statusFilter === status
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface border border-border text-gray-600 hover:text-gray-900 hover:bg-surface-muted'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tournaments Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={`tourn-skel-${i}`} className="p-5">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-9 w-full" />
            </Card>
          ))}
        </div>
      ) : tournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Trophy className="w-8 h-8 text-primary" />}
          title="No Tournaments Found"
          description={`No tournaments match the current status filter "${statusFilter}".`}
          action={
            isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') ? (
              <Link href="/tournaments/create">
                <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  Host a Tournament
                </Button>
              </Link>
            ) : undefined
          }
        />
      )}
    </PageLayout>
  );
}

