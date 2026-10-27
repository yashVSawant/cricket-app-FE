'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Activity,
  Flame,
  Radio,
  Sparkles,
  ShieldAlert,
  Search,
  CheckCircle,
  Plus,
  Send,
  Trash2,
  Users,
  Eye,
  RefreshCw,
} from 'lucide-react';

import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatCard } from '@/components/ui/StatCard';
import { useToast } from '@/components/ui/Toast';
import { FormField } from '@/components/forms/FormField';
import { SearchInput } from '@/components/forms/SearchInput';

interface DemoPlayer {
  id: string;
  name: string;
  team: string;
  role: string;
  matches: number;
  runs: number;
  wickets: number;
  status: 'ACTIVE' | 'BENCH';
}

const mockPlayers: DemoPlayer[] = [
  { id: '1', name: 'Virat Kohli', team: 'Royal Challengers', role: 'Batter', matches: 237, runs: 7263, wickets: 4, status: 'ACTIVE' },
  { id: '2', name: 'Jasprit Bumrah', team: 'Mumbai Indians', role: 'Bowler', matches: 120, runs: 65, wickets: 145, status: 'ACTIVE' },
  { id: '3', name: 'Hardik Pandya', team: 'Mumbai Indians', role: 'All-Rounder', matches: 123, runs: 2309, wickets: 53, status: 'ACTIVE' },
  { id: '4', name: 'KL Rahul', team: 'Super Giants', role: 'Wicket-Keeper', matches: 118, runs: 4163, wickets: 0, status: 'ACTIVE' },
  { id: '5', name: 'Rashid Khan', team: 'Gujarat Titans', role: 'Bowler', matches: 109, runs: 443, wickets: 139, status: 'ACTIVE' },
  { id: '6', name: 'Sanju Samson', team: 'Rajasthan Royals', role: 'Wicket-Keeper', matches: 152, runs: 3888, wickets: 0, status: 'BENCH' },
];

export default function StyleguidePage() {
  const { toast } = useToast();

  // Dialog states
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Form states
  const [inputText, setInputText] = useState('Super Premier League');
  const [selectVal, setSelectVal] = useState('t20');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [searchVal, setSearchVal] = useState('');

  // Table states
  const [tableLoading, setTableLoading] = useState(false);
  const [emptyTable, setEmptyTable] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const [sortBy, setSortBy] = useState('runs');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredPlayers = mockPlayers
    .filter((p) => p.name.toLowerCase().includes(searchVal.toLowerCase()) || p.team.toLowerCase().includes(searchVal.toLowerCase()))
    .sort((a, b) => {
      const fieldA = (a as unknown as Record<string, unknown>)[sortBy];
      const fieldB = (b as unknown as Record<string, unknown>)[sortBy];
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      return sortOrder === 'asc'
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const playerColumns: Column<DemoPlayer>[] = [
    {
      key: 'name',
      header: 'Player',
      sortable: true,
      accessor: (p) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={p.name} size="sm" status={p.status === 'ACTIVE' ? 'online' : 'offline'} />
          <div>
            <div className="font-semibold text-gray-900 leading-snug">{p.name}</div>
            <div className="text-xs text-gray-400">{p.team}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      accessor: (p) => <Badge variant="primary" size="sm">{p.role}</Badge>,
    },
    {
      key: 'matches',
      header: 'Matches',
      align: 'center',
      sortable: true,
    },
    {
      key: 'runs',
      header: 'Runs',
      align: 'right',
      sortable: true,
      accessor: (p) => <span className="font-bold text-gray-900">{p.runs}</span>,
    },
    {
      key: 'wickets',
      header: 'Wickets',
      align: 'right',
      sortable: true,
      accessor: (p) => <span className="font-bold text-primary-600">{p.wickets}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      accessor: (p) => (
        <Badge variant={p.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
          {p.status}
        </Badge>
      ),
    },
  ];

  return (
    <PageLayout
      title="CricketHub Design System & UI Kit"
      description="Production component library conforming to the Blue, White, and Orange theme tokens. All application views strictly compose from these primitives."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Design System / Styleguide' },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => toast.info('Refreshed styleguide assets', 'Asset Sync')}
          >
            Refresh
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => setModalOpen(true)}
          >
            Launch Modal Demo
          </Button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* SECTION 1: STAT CARDS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">1. Metric & Stat Cards</h2>
              <p className="text-xs text-gray-500">Live match indicators and career dashboard metrics.</p>
            </div>
            <Badge variant="live" size="md">LIVE ENGINE</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Tournaments"
              value="12"
              subtitle="4 concluding this week"
              change={{ value: '+2 new', isPositive: true }}
              icon={<Trophy className="w-5 h-5" />}
              variant="primary"
            />
            <StatCard
              title="Registered Players"
              value="1,420"
              subtitle="Across 88 verified teams"
              change={{ value: '+14% MoM', isPositive: true }}
              icon={<Users className="w-5 h-5" />}
              variant="default"
            />
            <StatCard
              title="Live Score Ingestion"
              value="3 Matches"
              subtitle="Socket.IO redis broadcast"
              change={{ value: 'Realtime', isPositive: true }}
              icon={<Radio className="w-5 h-5 text-accent-500" />}
              variant="accent"
            />
            <StatCard
              title="Pending Org Requests"
              value="5"
              subtitle="Awaiting Super Admin review"
              change={{ value: 'Action req.', isPositive: false }}
              icon={<ShieldAlert className="w-5 h-5 text-amber-500" />}
              variant="default"
            />
          </div>
        </section>

        {/* SECTION 2: BUTTONS */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">2. Buttons & Actions</h2>
            <p className="text-xs text-gray-500">Variants: primary (blue), accent (orange), outline, ghost, danger.</p>
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Action</Button>
                <Button variant="accent">Accent / Live CTA</Button>
                <Button variant="outline">Outline Action</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
                  Danger Action
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Small (sm)</Button>
                <Button variant="primary" size="md">Medium (md)</Button>
                <Button variant="primary" size="lg">Large (lg)</Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">States & Icons</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" isLoading>Loading State</Button>
                <Button variant="accent" isLoading>Accent Loading</Button>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                  Add Delivery
                </Button>
                <Button variant="outline" rightIcon={<Send className="w-4 h-4" />}>
                  Submit Request
                </Button>
                <Button variant="primary" disabled>
                  Disabled Button
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* SECTION 3: BADGES & STATUS PILLS */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">3. Status Pills & Badges</h2>
            <p className="text-xs text-gray-500">Includes pulsing LIVE badge for Socket.IO match broadcasts.</p>
          </div>

          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="live" size="lg">LIVE MATCH</Badge>
              <Badge variant="live" size="md">LIVE</Badge>
              <Badge variant="live" size="sm">LIVE</Badge>
              <Badge variant="primary" dot size="md">Tournament Open</Badge>
              <Badge variant="success" dot size="md">Completed</Badge>
              <Badge variant="warning" dot size="md">Pending Approval</Badge>
              <Badge variant="danger" dot size="md">Rejected / Abandoned</Badge>
              <Badge variant="info" size="md">ODI Format</Badge>
              <Badge variant="default" size="md">Scheduled</Badge>
            </div>
          </Card>
        </section>

        {/* SECTION 4: FORM CONTROLS */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">4. Form Controls & Field Wrappers</h2>
            <p className="text-xs text-gray-500">Accessible labels, required marks, error states, and helper texts.</p>
          </div>

          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                label="Tournament Name"
                htmlFor="tournamentName"
                required
                hint="Public title visible on all tournament banners"
              >
                <Input
                  id="tournamentName"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. IPL 2026"
                />
              </FormField>

              <FormField
                label="Tournament Format"
                htmlFor="tournamentFormat"
                required
              >
                <Select
                  id="tournamentFormat"
                  value={selectVal}
                  onChange={(e) => setSelectVal(e.target.value)}
                  options={[
                    { value: 't20', label: 'T20 (20 Overs)' },
                    { value: 'odi', label: 'One Day International (50 Overs)' },
                    { value: 't10', label: 'T10 Blitz (10 Overs)' },
                    { value: 'hundred', label: 'The Hundred (100 Balls)' },
                  ]}
                />
              </FormField>

              <FormField
                label="Input With Validation Error"
                htmlFor="invalidInput"
                error="Invalid email address format"
              >
                <Input
                  id="invalidInput"
                  defaultValue="invalid-email@"
                  error="Invalid email address format"
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField
                  label="Tournament Description & Ground Rules"
                  htmlFor="tournamentDesc"
                  hint="Provide pitch condition, max squads, and umpire protocol"
                >
                  <Textarea
                    id="tournamentDesc"
                    rows={3}
                    placeholder="Enter detailed instructions for team captains and scorers..."
                  />
                </FormField>
              </div>

              <div className="flex flex-col justify-end pb-1">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  label="Agree to Official Cricket Regulations"
                  description="Enforces 6-team player cap and one-team-per-tournament limit"
                />
              </div>
            </div>
          </Card>
        </section>

        {/* SECTION 5: DATA TABLE */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">5. Typed DataTable</h2>
              <p className="text-xs text-gray-500">Generic columns, sorting, pagination, and empty/loading states.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-56">
                <SearchInput
                  value={searchVal}
                  onChange={setSearchVal}
                  placeholder="Filter players or teams..."
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTableLoading(!tableLoading)}
              >
                {tableLoading ? 'Stop Loading' : 'Toggle Skeleton'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmptyTable(!emptyTable)}
              >
                {emptyTable ? 'Show Data' : 'Empty State'}
              </Button>
            </div>
          </div>

          <DataTable
            columns={playerColumns}
            data={emptyTable ? [] : filteredPlayers}
            keyExtractor={(p) => p.id}
            isLoading={tableLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            pagination={{
              page: tablePage,
              totalPages: 3,
              totalItems: 18,
              pageSize: 6,
              onPageChange: (p) => setTablePage(p),
            }}
            emptyState={{
              title: 'No players found',
              description: 'Try adjusting your search criteria or adding new players.',
              icon: <Users className="w-6 h-6 text-gray-400" />,
              action: (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setEmptyTable(false)}
                >
                  Reset Players
                </Button>
              ),
            }}
          />
        </section>

        {/* SECTION 6: TABS */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">6. Accessible Tabs</h2>
            <p className="text-xs text-gray-500">Used across Tournament detail, Match center, and Scorer consoles.</p>
          </div>

          <Card className="p-6">
            <Tabs defaultValue="fixtures">
              <TabsList>
                <TabsTrigger value="fixtures" icon={<Trophy className="w-4 h-4" />}>
                  Fixtures & Schedule
                </TabsTrigger>
                <TabsTrigger
                  value="live"
                  icon={<Radio className="w-4 h-4 text-accent-500" />}
                  badge={<Badge variant="live" size="sm">1</Badge>}
                >
                  Live Matches
                </TabsTrigger>
                <TabsTrigger value="leaderboards" icon={<Flame className="w-4 h-4" />}>
                  Leaderboards
                </TabsTrigger>
                <TabsTrigger value="squads" icon={<Users className="w-4 h-4" />}>
                  Registered Squads
                </TabsTrigger>
              </TabsList>

              <TabsContent value="fixtures" className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700 font-medium">
                  Fixtures Panel: Shows upcoming matches with venue details, toss info, and playing XI status.
                </p>
              </TabsContent>
              <TabsContent value="live" className="p-4 bg-accent-50/50 rounded-lg border border-accent-200">
                <p className="text-sm text-accent-900 font-medium">
                  Live Match Center: Active ball-by-ball stream with real-time strike rotation and undo capabilities.
                </p>
              </TabsContent>
              <TabsContent value="leaderboards" className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700 font-medium">
                  Leaderboards Panel: Top run scorers (Orange Cap), top wicket takers (Purple Cap), and highest strike rates.
                </p>
              </TabsContent>
              <TabsContent value="squads" className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700 font-medium">
                  Tournament Squads: Snapshot of verified team rosters enforcing the 1-tournament-per-player rule.
                </p>
              </TabsContent>
            </Tabs>
          </Card>
        </section>

        {/* SECTION 7: TOAST NOTIFICATIONS */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">7. Toast Notification System</h2>
            <p className="text-xs text-gray-500">Provides real-time user feedback for actions and errors.</p>
          </div>

          <Card className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                onClick={() => toast.success('Delivery recorded: 4 runs off the bat!', 'Boundary Recorded')}
              >
                Trigger Success Toast
              </Button>
              <Button
                variant="outline"
                className="text-red-700 border-red-200 hover:bg-red-50"
                onClick={() => toast.error('Player is already in another team in this tournament.', 'Registration Rejected')}
              >
                Trigger Error Toast
              </Button>
              <Button
                variant="outline"
                className="text-amber-700 border-amber-200 hover:bg-amber-50"
                onClick={() => toast.warning('Bowler has 1 over remaining in this spell.', 'Over Limit Warning')}
              >
                Trigger Warning Toast
              </Button>
              <Button
                variant="outline"
                className="text-blue-700 border-blue-200 hover:bg-blue-50"
                onClick={() => toast.info('Socket connection re-established with Redis cluster.', 'Live Sync')}
              >
                Trigger Info Toast
              </Button>
            </div>
          </Card>
        </section>

        {/* SECTION 8: MODALS & CONFIRM DIALOGS */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">8. Dialogs & Modals</h2>
            <p className="text-xs text-gray-500">Accessible overlays with focus trapping, backdrop blur, and escape handling.</p>
          </div>

          <Card className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Open Standard Modal
              </Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                Open Destructive Confirm Dialog
              </Button>
            </div>
          </Card>

          {/* Standard Modal Demo */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Create New Tournament"
            description="Organizers can publish tournaments after SUPER_ADMIN approval."
            size="lg"
            footer={
              <>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setModalOpen(false);
                    toast.success('Tournament drafted successfully!');
                  }}
                >
                  Create Tournament
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <FormField label="Tournament Name" required>
                <Input placeholder="e.g. Champions Trophy 2026" />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Format">
                  <Select
                    options={[
                      { value: 'T20', label: 'T20' },
                      { value: 'ODI', label: 'ODI' },
                      { value: 'T10', label: 'T10' },
                    ]}
                  />
                </FormField>
                <FormField label="Overs Per Innings">
                  <Input type="number" defaultValue="20" />
                </FormField>
              </div>
            </div>
          </Modal>

          {/* Destructive Confirm Dialog Demo */}
          <ConfirmDialog
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={() => {
              setConfirmLoading(true);
              setTimeout(() => {
                setConfirmLoading(false);
                setConfirmOpen(false);
                toast.success('Last delivery was undone and score reverted.');
              }, 600);
            }}
            title="Undo Last Delivery?"
            message="This will remove delivery #18.4, decrement bowler and striker stats, and broadcast an update to all connected live viewers."
            confirmText="Yes, Undo Ball"
            cancelText="Keep Ball"
            isDestructive
            isLoading={confirmLoading}
          />
        </section>
      </div>
    </PageLayout>
  );
}
