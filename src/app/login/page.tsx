'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogIn,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useLoginMutation } from '@/services/api/authApi';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loginMutation, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    try {
      const result = await loginMutation({
        email: email.trim(),
        password,
      }).unwrap();

      toast.success(
        'Successfully logged in to CricketHub.',
        `Welcome back, ${result.user.name}!`,
      );

      router.push('/');
    } catch (err: any) {
      const errorText =
        err?.data?.message ||
        err?.error ||
        'Invalid email or password. Please try again.';
      setErrorMessage(errorText);
    }
  };

  return (
    <PageLayout maxWidth="xl" className="py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-50 border border-secondary-200 text-xs font-semibold text-secondary-700 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cricket Tournament Platform</span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Sign In to CricketHub
          </h1>
          <p className="mt-2 text-sm text-muted">
            Access your team roster, tournament management, and scoring tools.
          </p>
        </div>

        {/* Public Notice Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-3 text-xs text-blue-900 leading-relaxed shadow-sm">
          <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
          <span>
            <strong>Watching matches is free & open:</strong> You do not need to sign in to watch live matches, scorecards, or player statistics.
          </span>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8 border-border bg-surface shadow-sm">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2 text-[11px] text-muted">
              <Lock className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>Encrypted session with secure HTTP-only cookies.</span>
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center text-xs text-muted">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/register"
              className="font-bold text-primary hover:text-primary-800 transition-colors underline"
            >
              Register here
            </Link>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
