import React from 'react';
import Link from 'next/link';
import { Trophy, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Tournament } from '@/types';

export interface TournamentCardProps {
  tournament: Tournament;
  className?: string;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  className,
}) => {
  return (
    <Card hoverable className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base line-clamp-1">
              {tournament.name}
            </CardTitle>
            <span className="text-xs text-muted">
              {tournament.format} • {tournament.oversPerInnings} Overs
            </span>
          </div>
        </div>
        <Badge
          variant={
            tournament.status === 'ONGOING'
              ? 'success'
              : tournament.status === 'COMPLETED'
              ? 'default'
              : 'primary'
          }
          size="sm"
        >
          {tournament.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{tournament.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>
            {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
          </span>
        </div>
        {tournament.registrationsCount !== undefined && (
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{tournament.registrationsCount} Teams Registered</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-border-muted">
        <Link href={`/tournaments/${tournament.id}`} className="w-full">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Tournament Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
