export type Role = 'PLAYER' | 'SCORER' | 'ADMIN' | 'SUPER_ADMIN';
export type OrgStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'ABANDONED';
export type ExtraType = 'NONE' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE';
export type WicketType = 'BOWLED' | 'CAUGHT' | 'LBW' | 'RUN_OUT' | 'STUMPED' | 'HIT_WICKET';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  playerKey?: string | null;
  organizerId?: string | null;
  createdAt: string;
}

export interface Organizer {
  id: string;
  name: string;
  contactEmail: string;
  phone?: string | null;
  description?: string | null;
  status: OrgStatus;
  reviewedById?: string | null;
  reviewNote?: string | null;
  createdAt: string;
}

export interface PlayerCareerStats {
  playerId: string;
  matches: number;
  innings: number;
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  highScore: number;
  ballsBowled: number;
  runsConceded: number;
  wickets: number;
}

export interface PlayerProfile {
  userId: string;
  battingStyle?: string | null;
  bowlingStyle?: string | null;
  career?: PlayerCareerStats | null;
}

export interface TeamMember {
  teamId: string;
  playerId: string;
  status: 'INVITED' | 'ACCEPTED' | 'REJECTED';
  createdAt?: string;
  player: {
    id: string;
    name: string;
    email: string;
    playerKey?: string | null;
    playerProfile?: {
      battingStyle?: string | null;
      bowlingStyle?: string | null;
    } | null;
  };
}

export interface Team {
  id: string;
  name: string;
  teamKey: string;
  captainId: string;
  captain?: {
    id: string;
    name: string;
    email: string;
    playerKey?: string | null;
  };
  members?: TeamMember[];
  activeMemberCount?: number;
  invitedMemberCount?: number;
  totalMemberCount?: number;
  maxAllowed?: number;
  createdAt: string;
}

export interface Tournament {
  id: string;
  organizerId: string;
  organizer?: Organizer;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  format: string;
  oversPerInnings: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  description?: string | null;
  banner?: string | null;
  registrationsCount?: number;
  matchesCount?: number;
}

export interface TournamentTeam {
  id: string;
  tournamentId: string;
  teamId: string;
  displayName: string;
  team?: Team;
}

export interface Delivery {
  id: string;
  inningsId: string;
  seq: number;
  over: number;
  ballInOver: number;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  runsOffBat: number;
  extraType: ExtraType;
  extraRuns: number;
  isFour: boolean;
  isSix: boolean;
  wicketType?: WicketType | null;
  dismissedId?: string | null;
  fielderId?: string | null;
  strikerName?: string;
  bowlerName?: string;
}

export interface Innings {
  id: string;
  matchId: string;
  number: number;
  battingTeamId: string;
  bowlingTeamId: string;
  runs: number;
  wickets: number;
  balls: number;
  deliveries?: Delivery[];
}

export interface PlayerMatchStats {
  matchId: string;
  playerId: string;
  playerName?: string;
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  ballsBowled: number;
  runsConceded: number;
  wickets: number;
  maidens: number;
  catches: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  tournament?: Tournament;
  teamAId: string;
  teamAName?: string;
  teamBId: string;
  teamBName?: string;
  scorerId?: string | null;
  venue: string;
  startTime: string;
  status: MatchStatus;
  tossWonBy?: string | null;
  result?: string | null;
  innings?: Innings[];
  stats?: PlayerMatchStats[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  meta?: PaginationMeta;
  message?: string;
  errors?: unknown;
}
