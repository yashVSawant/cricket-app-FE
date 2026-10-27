'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Crown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  LogIn,
  UserCheck,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import {
  useSearchPlayersQuery,
  useCreateTeamMutation,
  PlayerSearchResult,
} from '@/services/api/teamsApi';

export default function CreateTeamPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  const [teamName, setTeamName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerSearchResult[]>([]);
  const [createdTeam, setCreatedTeam] = useState<any | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createTeamMutation, { isLoading: isCreating }] = useCreateTeamMutation();

  // Debounce search query by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Query players when debounced query has at least 1 character
  const { data: searchResults = [], isFetching: isSearching } = useSearchPlayersQuery(
    debouncedQuery,
    { skip: debouncedQuery.length === 0 },
  );

  const MAX_PLAYERS = 11;
  // Total players = 1 captain + selected invited players
  const currentTotalCount = 1 + selectedPlayers.length;
  const isTeamFull = currentTotalCount >= MAX_PLAYERS;

  // Add player to local roster
  const handleAddPlayer = (player: PlayerSearchResult) => {
    if (isTeamFull) {
      toast.warning(`A team can have a maximum of ${MAX_PLAYERS} players.`, 'Team Full');
      return;
    }

    if (selectedPlayers.some((p) => p.id === player.id)) {
      toast.info('This player is already in your team roster.', 'Already Added');
      return;
    }

    setSelectedPlayers((prev) => [...prev, player]);
    setSearchQuery('');
    setDebouncedQuery('');
    toast.success(
      `Added ${player.name} to team roster as Invited/Inactive.`,
      'Player Added',
    );
  };

  // Remove player from local roster
  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.id !== playerId));
    toast.info('Player removed from team roster.', 'Removed');
  };

  // Submit team creation
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!teamName.trim()) {
      setErrorMessage('Please enter a team name.');
      return;
    }

    try {
      const payload = {
        name: teamName.trim(),
        playerIds: selectedPlayers.map((p) => p.id),
      };

      const result = await createTeamMutation(payload).unwrap();
      setCreatedTeam(result);

      toast.success(
        `Team "${result.name}" created! Team Key: ${result.teamKey}`,
        'Team Created Successfully!',
      );
    } catch (err: any) {
      const errorText =
        err?.data?.message ||
        err?.error ||
        'Failed to create team. Please verify your details.';
      setErrorMessage(errorText);
    }
  };

  const handleCopyKey = () => {
    if (createdTeam?.teamKey) {
      navigator.clipboard.writeText(createdTeam.teamKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast.success('Team key copied to clipboard!', 'Copied');
    }
  };

  // If not logged in, prompt to log in / register
  if (!isAuthLoading && !isAuthenticated) {
    return (
      <PageLayout maxWidth="xl" className="py-12">
        <Card className="p-8 text-center border-border bg-surface shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-secondary-50 text-secondary-600 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign In to Create a Team
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto mb-6 leading-relaxed">
            While anyone can watch tournaments and live scores without an account, creating a cricket team and captaining a squad requires being signed in.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/login">
              <Button variant="secondary" size="md" leftIcon={<LogIn className="w-4 h-4" />}>
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="md">
                Register as Player
              </Button>
            </Link>
          </div>
        </Card>
      </PageLayout>
    );
  }

  // If team was successfully created, show confirmation & team key card
  if (createdTeam) {
    return (
      <PageLayout maxWidth="2xl" className="py-10">
        <Card className="p-8 border-border bg-surface text-center shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            Team Created Successfully!
          </h2>
          <p className="text-sm text-muted mb-6">
            You are the captain of <strong className="text-gray-900">{createdTeam.name}</strong>.
          </p>

          {/* Team Key Highlight Box */}
          <div className="p-4 rounded-xl bg-primary-50 border border-primary-200 max-w-md mx-auto mb-6 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Official Unique Team Key
              </span>
              <Badge variant="primary" size="sm">Share with Organizer</Badge>
            </div>
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-primary-200 font-mono text-lg font-bold text-primary-900">
              <span>{createdTeam.teamKey}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyKey}
                className="text-primary-700 hover:text-primary-900 p-1.5"
                title="Copy Team Key"
              >
                {copySuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-[11px] text-primary-600 mt-2">
              Tournament organizers use this unique Team Key to register your team into tournaments.
            </p>
          </div>

          {/* Roster Summary */}
          <div className="max-w-md mx-auto text-left mb-6 p-4 rounded-xl border border-border bg-surface-muted text-xs text-gray-700">
            <div className="flex items-center justify-between mb-3 font-semibold text-gray-900 text-sm">
              <span>Roster Summary</span>
              <span>{createdTeam.members?.length || 1} / 11 Players</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center justify-between bg-white p-2 rounded border border-border">
                <span className="font-bold flex items-center gap-1.5 text-gray-900">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  {user?.name} (Captain)
                </span>
                <Badge variant="success" size="sm">Active</Badge>
              </li>
              {createdTeam.members
                ?.filter((m: any) => m.playerId !== user?.id)
                .map((m: any) => (
                  <li
                    key={m.playerId}
                    className="flex items-center justify-between bg-white p-2 rounded border border-border"
                  >
                    <span className="text-gray-800">{m.player?.name}</span>
                    <Badge variant="warning" size="sm">Invited (Pending)</Badge>
                  </li>
                ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setCreatedTeam(null);
                setTeamName('');
                setSelectedPlayers([]);
              }}
            >
              Create Another Team
            </Button>
            <Link href="/tournaments">
              <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse Tournaments
              </Button>
            </Link>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="2xl" className="py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Title & Intro */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-50 border border-secondary-200 text-xs font-semibold text-secondary-700 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cricket Team Creator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Your Cricket Team
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
            As creator, you will automatically become the <strong>Captain</strong>. You can search and invite up to 10 additional players (max 11 total). Invited players remain inactive until they accept their invitation.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* SECTION 1: Team Name & Captain Bar */}
        <Card className="p-5 border-border bg-surface shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                Team Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="teamName"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="e.g., Mumbai Titans, Royal Challengers, Delhi Strikers"
                className="text-base font-semibold"
                required
              />
            </div>

            {/* Captain Info Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Crown className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <span className="font-bold text-gray-900">{user?.name}</span>{' '}
                  <span className="text-muted">(Captain / Creator)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted">Player Key:</span>
                <Badge variant="primary" size="sm">{user?.playerKey || 'Captain'}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 2: Search Players Input Field */}
        <Card className="p-5 border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Search Players by Player Key, Name, or Email
            </label>
            <span
              className={`text-xs font-bold ${
                isTeamFull ? 'text-red-600' : 'text-primary'
              }`}
            >
              Squad: {currentTotalCount} / {MAX_PLAYERS} Players
            </span>
          </div>

          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Player Key (e.g. PL-ABC123), Name, or Email..."
              leftIcon={<Search className="w-4 h-4" />}
              disabled={isTeamFull}
            />
          </div>

          {/* Search Results Dropdown / Cards */}
          {searchQuery.trim().length > 0 && (
            <div className="mt-3 border border-border rounded-xl bg-surface divide-y divide-border overflow-hidden shadow-sm">
              {isSearching ? (
                <div className="p-4 text-center text-xs text-muted">
                  Searching player database...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted">
                  No registered players found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                searchResults.map((player) => {
                  const isAlreadyAdded = selectedPlayers.some((p) => p.id === player.id);

                  return (
                    <div
                      key={player.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={player.name} size="sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900">
                              {player.name}
                            </span>
                            {player.playerKey && (
                              <Badge variant="primary" size="sm">
                                {player.playerKey}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted mt-0.5">
                            {player.email} •{' '}
                            <span className="font-medium text-gray-700">
                              {player.playerProfile?.battingStyle || 'Batter'} •{' '}
                              {player.playerProfile?.bowlingStyle || 'Bowler'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        {isAlreadyAdded ? (
                          <Badge variant="default" size="sm" className="text-muted">
                            Already Added
                          </Badge>
                        ) : isTeamFull ? (
                          <Badge variant="danger" size="sm">
                            Team Full (11 Max)
                          </Badge>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAddPlayer(player)}
                            leftIcon={<Plus className="w-3.5 h-3.5" />}
                          >
                            Add to Team
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </Card>

        {/* SECTION 3: Team Roster (11 Slots) */}
        <Card className="p-5 border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base">Team Roster (Max 11 Players)</CardTitle>
              <p className="text-xs text-muted mt-0.5">
                Invited players are added as inactive until they accept their invitation. Only you (the Captain) can add or remove players.
              </p>
            </div>
            <Badge
              variant={isTeamFull ? 'danger' : 'secondary'}
              size="md"
              className="font-bold"
            >
              {currentTotalCount} / {MAX_PLAYERS} Slots
            </Badge>
          </div>

          <div className="space-y-2.5">
            {/* Slot 1: Captain (Creator) */}
            <div className="p-3.5 rounded-xl border-2 border-amber-200 bg-amber-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-extrabold text-xs">
                  1
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{user?.name}</span>
                    <Badge variant="warning" size="sm" dot>Captain</Badge>
                  </div>
                  <p className="text-xs text-muted">
                    {user?.email} {user?.playerKey && `• ${user.playerKey}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">Active (Member)</Badge>
              </div>
            </div>

            {/* Slots 2 to 11: Invited Players */}
            {selectedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-muted text-gray-600 flex items-center justify-center font-bold text-xs border border-border">
                    {index + 2}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{player.name}</span>
                      {player.playerKey && (
                        <Badge variant="primary" size="sm">{player.playerKey}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted">
                      {player.email} • {player.playerProfile?.battingStyle || 'Right-hand bat'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="warning" size="sm">
                    <Clock className="w-3 h-3 mr-1" />
                    Inactive (Invited)
                  </Badge>

                  {/* Captain remove action */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePlayer(player.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5"
                    title="Remove player from team"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Remaining Empty Slots Display */}
            {Array.from({ length: MAX_PLAYERS - currentTotalCount }).map((_, i) => {
              const slotNumber = currentTotalCount + i + 1;
              return (
                <div
                  key={`empty-slot-${slotNumber}`}
                  className="p-3 rounded-xl border border-dashed border-gray-200 bg-surface-muted/50 flex items-center justify-between text-xs text-muted"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-semibold text-[11px]">
                      {slotNumber}
                    </div>
                    <span>Slot {slotNumber}: Empty &mdash; Search player above to invite</span>
                  </div>
                  <span className="text-[11px] text-gray-400">Available</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* SECTION 4: Submit Button */}
        <div className="pt-2">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleCreateTeam}
            isLoading={isCreating}
            disabled={!teamName.trim()}
            leftIcon={<Users className="w-5 h-5" />}
          >
            Create Team & Send Invites ({currentTotalCount} / {MAX_PLAYERS} Players)
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

