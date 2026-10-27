'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatOvers } from '@/lib/utils';
import { Match, Innings } from '@/types';

export interface ScoreCardProps {
  match: Match;
  className?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ match, className }) => {
  const currentInnings: Innings | undefined =
    match.innings && match.innings.length > 0
      ? match.innings[match.innings.length - 1]
      : undefined;

  return (
    <Card hoverable className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {match.tournament?.name || 'Tournament Match'}
          </span>
          <CardTitle className="mt-1 text-base">
            {match.teamAName || 'Team Alpha'} vs {match.teamBName || 'Team Beta'}
          </CardTitle>
        </div>
        {match.status === 'LIVE' ? (
          <Badge variant="live" size="sm">
            LIVE
          </Badge>
        ) : (
          <Badge
            variant={match.status === 'COMPLETED' ? 'success' : 'default'}
            size="sm"
          >
            {match.status}
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        {currentInnings ? (
          <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-gray-100">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-primary-900">
                {currentInnings.runs}/{currentInnings.wickets}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Overs: {formatOvers(currentInnings.balls)} / 20
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-gray-500">
                CR: {currentInnings.balls > 0 ? ((currentInnings.runs / (currentInnings.balls / 6))).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
            Match scheduled to start at {new Date(match.startTime).toLocaleTimeString()}
          </div>
        )}

        {match.result && (
          <div className="mt-3 text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1.5 rounded-md">
            {match.result}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
