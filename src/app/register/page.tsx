'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  Trophy,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useRegisterMutation } from '@/services/api/authApi';
import { useToast } from '@/components/ui/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const [accountType, setAccountType] = useState<'PLAYER' | 'ADMIN'>('PLAYER');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    organizationName: '',
    phone: '',
    organizationDescription: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (accountType === 'ADMIN' && !formData.organizationName.trim()) {
      setErrorMessage('Please enter your organization or club name.');
      return;
    }

    try {
      const payload: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: accountType,
      };

      if (accountType === 'PLAYER') {
        payload.battingStyle = formData.battingStyle;
        payload.bowlingStyle = formData.bowlingStyle;
      } else {
        payload.organizationName = formData.organizationName.trim();
        payload.phone = formData.phone.trim() || undefined;
        payload.organizationDescription = formData.organizationDescription.trim() || undefined;
      }

      await registerMutation(payload).unwrap();

      toast.success(
        accountType === 'ADMIN'
          ? 'Organizer application submitted. You can now access organizer tools!'
          : 'Welcome to CricketHub! Your player profile is ready.',
        'Account Created!',
      );

      router.push('/');
    } catch (err: any) {
      const errorText =
        err?.data?.message ||
        err?.error ||
        'Registration failed. Please check your details and try again.';
      setErrorMessage(errorText);
    }
  };

  return (
    <PageLayout maxWidth="2xl" className="py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-50 border border-secondary-200 text-xs font-semibold text-secondary-700 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join the Premier Cricket Platform</span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto leading-relaxed">
            Register to create teams, join tournament rosters, and record official ball-by-ball match careers.
          </p>
        </div>

        {/* Public Notice Card */}
        <div className="mb-6 p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-3 text-xs text-blue-900 leading-relaxed shadow-sm">
          <ShieldCheck className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Public Data Reminder:</span> Anyone can watch live scores, tournament leaderboards, and player stats without creating an account or logging in. An account is only required when you want to{' '}
            <span className="font-semibold text-primary-800">create teams, organize tournaments, or enter official scores</span>.
          </div>
        </div>

        {/* Account Type Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-surface-muted border border-border rounded-xl">
          <button
            type="button"
            onClick={() => setAccountType('PLAYER')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all select-none cursor-pointer ${
              accountType === 'PLAYER'
                ? 'bg-surface text-primary-900 shadow-sm border border-border'
                : 'text-muted hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 text-primary-600" />
            <span>Cricket Player</span>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('ADMIN')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all select-none cursor-pointer ${
              accountType === 'ADMIN'
                ? 'bg-surface text-secondary-900 shadow-sm border border-border'
                : 'text-muted hover:text-gray-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-secondary-600" />
            <span>Tournament Organizer</span>
          </button>
        </div>

        {/* Registration Form Card */}
        <Card className="p-6 sm:p-8 border-border bg-surface shadow-sm">
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Common: Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={accountType === 'PLAYER' ? 'e.g., Rohit Sharma' : 'e.g., Anant Verma'}
                required
              />
            </div>

            {/* Common: Email Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />
            </div>

            {/* Account Specific Fields: PLAYER */}
            {accountType === 'PLAYER' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Batting Style
                  </label>
                  <Select
                    name="battingStyle"
                    value={formData.battingStyle}
                    onChange={handleChange}
                    options={[
                      { value: 'Right-hand bat', label: 'Right-hand bat' },
                      { value: 'Left-hand bat', label: 'Left-hand bat' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Bowling Style
                  </label>
                  <Select
                    name="bowlingStyle"
                    value={formData.bowlingStyle}
                    onChange={handleChange}
                    options={[
                      { value: 'Right-arm medium', label: 'Right-arm medium / fast' },
                      { value: 'Right-arm spin', label: 'Right-arm spin / off-break' },
                      { value: 'Left-arm fast', label: 'Left-arm fast' },
                      { value: 'Left-arm spin', label: 'Left-arm spin' },
                      { value: 'Wicketkeeper', label: 'Wicketkeeper (Non-bowler)' },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Account Specific Fields: ORGANIZER */}
            {accountType === 'ADMIN' && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Organization / Club / Academy Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="e.g., Bengaluru Sports Club or State Premier League"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Contact Phone Number (Optional)
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Organization Brief (Optional)
                  </label>
                  <Input
                    name="organizationDescription"
                    value={formData.organizationDescription}
                    onChange={handleChange}
                    placeholder="Brief description of past tournaments or club history"
                  />
                </div>
              </div>
            )}

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <Input
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>

            {/* Cookie & Security Guarantee */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-muted">
              <Lock className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>
                Protected session: HTTP-only cookies keep your login credentials safe against cross-site scripting.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                {accountType === 'PLAYER'
                  ? 'Complete Player Registration'
                  : 'Submit Organizer Application'}
              </Button>
            </div>
          </form>

          {/* Sign In Alternative Link */}
          <div className="mt-6 pt-5 border-t border-border text-center text-xs text-muted">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-primary hover:text-primary-800 transition-colors underline"
            >
              Sign In to Your Account
            </Link>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
