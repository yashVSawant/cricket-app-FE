'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  LogIn,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { useCreateTournamentMutation } from '@/services/api/tournamentsApi';

export default function CreateTournamentPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [createTournamentMutation, { isLoading: isCreating }] = useCreateTournamentMutation();

  // Tomorrow's date string YYYY-MM-DD for min date calculation
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minStartDateStr = tomorrow.toISOString().split('T')[0];

  const defaultEnd = new Date(tomorrow);
  defaultEnd.setDate(defaultEnd.getDate() + 7);
  const defaultEndDateStr = defaultEnd.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: minStartDateStr,
    endDate: defaultEndDateStr,
    format: 'T20',
    oversPerInnings: 20,
    description: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Auto adjust overs if format changes
      if (name === 'format') {
        if (value === 'T10') next.oversPerInnings = 10;
        else if (value === 'T20') next.oversPerInnings = 20;
        else if (value === 'ODI') next.oversPerInnings = 50;
      }
      return next;
    });
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.location.trim()) {
      setErrorMessage('Tournament Name and Location are required.');
      return;
    }

    // STRICT DATE VALIDATION: Date can NOT be less than or equal to today
    const selectedStart = new Date(formData.startDate);
    selectedStart.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedStart.getTime() <= today.getTime()) {
      setErrorMessage('Tournament start date must be strictly after today (cannot be today or in the past).');
      return;
    }

    const selectedEnd = new Date(formData.endDate);
    selectedEnd.setHours(0, 0, 0, 0);

    if (selectedEnd.getTime() < selectedStart.getTime()) {
      setErrorMessage('Tournament end date cannot be earlier than start date.');
      return;
    }

    try {
      const result = await createTournamentMutation({
        name: formData.name.trim(),
        location: formData.location.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        format: formData.format,
        oversPerInnings: Number(formData.oversPerInnings),
        description: formData.description.trim() || undefined,
      }).unwrap();

      toast.success(
        `Tournament "${result.name}" has been created! You can now register teams and schedule matches.`,
        'Tournament Created!',
      );

      router.push(`/tournaments/${result.id}`);
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.error ||
        'Failed to create tournament. Please check your inputs.';
      setErrorMessage(msg);
    }
  };

  // Auth Guard
  if (!isAuthLoading && !isAuthenticated) {
    return (
      <PageLayout maxWidth="xl" className="py-12">
        <Card className="p-8 text-center border-border bg-surface shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-secondary-50 text-secondary-600 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Organizer Sign In Required
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto mb-6 leading-relaxed">
            While viewing tournaments and live matches is open for everyone, organizing tournaments and scheduling matches requires an Organizer account.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/login">
              <Button variant="secondary" size="md" leftIcon={<LogIn className="w-4 h-4" />}>
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="md">
                Register as Organizer
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
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-50 border border-secondary-200 text-xs font-semibold text-secondary-700 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organizer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Create New Tournament
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
            Configure your tournament format, location, and dates. Once created, you can register up to 6 teams and schedule matches.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700 font-medium shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Card className="p-6 sm:p-8 border-border bg-surface shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tournament Name */}
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                Tournament Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., National Premier T20 Cup 2026"
                className="text-base font-semibold"
                required
              />
            </div>

            {/* Location / Venue */}
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                Tournament Venue / Location <span className="text-red-500">*</span>
              </label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Wankhede Stadium, Mumbai"
                leftIcon={<MapPin className="w-4 h-4" />}
                required
              />
            </div>

            {/* Date Pickers with Strict Minimum Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  name="startDate"
                  min={minStartDateStr} // Enforces HTML5 browser min date constraint
                  value={formData.startDate}
                  onChange={handleChange}
                  leftIcon={<Calendar className="w-4 h-4" />}
                  required
                />
                <p className="text-[11px] text-muted mt-1">
                  Must be strictly after today (from {minStartDateStr} onwards).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  name="endDate"
                  min={formData.startDate || minStartDateStr}
                  value={formData.endDate}
                  onChange={handleChange}
                  leftIcon={<Calendar className="w-4 h-4" />}
                  required
                />
                <p className="text-[11px] text-muted mt-1">
                  End of tournament finals.
                </p>
              </div>
            </div>

            {/* Format & Overs per Innings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  Tournament Format <span className="text-red-500">*</span>
                </label>
                <Select
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  options={[
                    { value: 'T20', label: 'T20 (20 Overs per innings)' },
                    { value: 'T10', label: 'T10 (10 Overs per innings)' },
                    { value: 'ODI', label: 'ODI (50 Overs per innings)' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  Overs per Innings <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="oversPerInnings"
                  value={formData.oversPerInnings}
                  onChange={handleChange}
                  min={5}
                  max={50}
                  required
                />
              </div>
            </div>

            {/* Optional Description */}
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                Description / Ground Rules (Optional)
              </label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief guidelines, pitch details, or tournament prize info..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                isLoading={isCreating}
                leftIcon={<Trophy className="w-5 h-5" />}
              >
                Create Tournament & Open Fixtures
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}

