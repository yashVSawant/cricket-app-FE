import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Match } from '@/types';

export interface MatchCardProps {
  match: Match;
  className?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, className }) => {
  return (
    <Card hoverable className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(match.startTime)}</span>
        </div>
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
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900 text-base">
            {match.teamAName || 'Team A'}
          </span>
          <span className="text-xs font-semibold text-gray-400">VS</span>
          <span className="font-bold text-gray-900 text-base">
            {match.teamBName || 'Team B'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{match.venue}</span>
        </div>

        {match.result && (
          <p className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
            {match.result}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-border-muted">
        <Link href={`/live/${match.id}`} className="w-full">
          <Button
            variant={match.status === 'LIVE' ? 'secondary' : 'outline'}
            size="sm"
            fullWidth
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {match.status === 'LIVE' ? 'Watch Live' : 'View Match Center'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
