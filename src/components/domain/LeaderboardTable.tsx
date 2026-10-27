'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  teamName: string;
  matches: number;
  statValue: number | string;
  secondaryStat?: string;
}

export interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  statTitle: string;
  isLoading?: boolean;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  statTitle,
  isLoading = false,
}) => {
  const columns: Column<LeaderboardEntry>[] = [
    {
      key: 'rank',
      header: 'Rank',
      width: '60px',
      accessor: (entry) => {
        if (entry.rank === 1) {
          return (
            <Badge variant="accent" size="sm" className="font-black">
              #1
            </Badge>
          );
        }
        if (entry.rank === 2) {
          return (
            <Badge variant="primary" size="sm" className="font-bold">
              #2
            </Badge>
          );
        }
        if (entry.rank === 3) {
          return (
            <Badge variant="warning" size="sm" className="font-bold">
              #3
            </Badge>
          );
        }
        return <span className="font-semibold text-gray-500">#{entry.rank}</span>;
      },
    },
    {
      key: 'playerName',
      header: 'Player',
      accessor: (entry) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={entry.playerName} size="sm" />
          <div>
            <p className="font-semibold text-gray-900 leading-snug">
              {entry.playerName}
            </p>
            <p className="text-xs text-gray-400">{entry.teamName}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'matches',
      header: 'Matches',
      align: 'center',
    },
    {
      key: 'statValue',
      header: statTitle,
      align: 'right',
      accessor: (entry) => (
        <div className="text-right">
          <span className="font-extrabold text-base text-primary-700">
            {entry.statValue}
          </span>
          {entry.secondaryStat && (
            <p className="text-[11px] text-gray-400">{entry.secondaryStat}</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={entries}
      keyExtractor={(entry) => `${entry.rank}-${entry.playerId}`}
      isLoading={isLoading}
      emptyState={{
        title: 'No leaderboard data',
        description: 'Leaderboard will update as matches complete.',
        icon: <Trophy className="w-6 h-6 text-accent-500" />,
      }}
    />
  );
};
