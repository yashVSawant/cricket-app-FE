'use client';

import React from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { PlayerMatchStats } from '@/types';
import { calculateStrikeRate, formatOvers, calculateEconomy } from '@/lib/utils';

export interface PlayerStatsTableProps {
  stats: PlayerMatchStats[];
  type?: 'batting' | 'bowling';
  isLoading?: boolean;
}

export const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({
  stats,
  type = 'batting',
  isLoading = false,
}) => {
  const battingColumns: Column<PlayerMatchStats>[] = [
    {
      key: 'playerName',
      header: 'Batter',
      accessor: (s) => (
        <div className="font-semibold text-gray-900">
          {s.playerName || 'Player'}
        </div>
      ),
    },
    {
      key: 'isOut',
      header: 'Dismissal',
      accessor: (s) =>
        s.isOut ? (
          <span className="text-xs text-gray-500">b Bowler</span>
        ) : (
          <Badge variant="success" size="sm">
            Not Out
          </Badge>
        ),
    },
    {
      key: 'runs',
      header: 'Runs',
      align: 'right',
      accessor: (s) => (
        <span className="font-bold text-gray-900">{s.runs}</span>
      ),
    },
    { key: 'ballsFaced', header: 'Balls', align: 'right' },
    {
      key: 'fours',
      header: '4s',
      align: 'right',
      accessor: (s) => (
        <span className={s.fours > 0 ? 'text-accent-600 font-semibold' : ''}>
          {s.fours}
        </span>
      ),
    },
    {
      key: 'sixes',
      header: '6s',
      align: 'right',
      accessor: (s) => (
        <span className={s.sixes > 0 ? 'text-accent-600 font-bold' : ''}>
          {s.sixes}
        </span>
      ),
    },
    {
      key: 'sr',
      header: 'SR',
      align: 'right',
      accessor: (s) => calculateStrikeRate(s.runs, s.ballsFaced),
    },
  ];

  const bowlingColumns: Column<PlayerMatchStats>[] = [
    {
      key: 'playerName',
      header: 'Bowler',
      accessor: (s) => (
        <div className="font-semibold text-gray-900">
          {s.playerName || 'Player'}
        </div>
      ),
    },
    {
      key: 'overs',
      header: 'Overs',
      align: 'right',
      accessor: (s) => formatOvers(s.ballsBowled),
    },
    { key: 'maidens', header: 'Maidens', align: 'right' },
    { key: 'runsConceded', header: 'Runs', align: 'right' },
    {
      key: 'wickets',
      header: 'Wickets',
      align: 'right',
      accessor: (s) => (
        <span className="font-bold text-primary-600">{s.wickets}</span>
      ),
    },
    {
      key: 'economy',
      header: 'Econ',
      align: 'right',
      accessor: (s) => calculateEconomy(s.runsConceded, s.ballsBowled),
    },
  ];

  return (
    <DataTable
      columns={type === 'batting' ? battingColumns : bowlingColumns}
      data={stats}
      keyExtractor={(item) => `${item.matchId}-${item.playerId}`}
      isLoading={isLoading}
    />
  );
};
