'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Trophy,
  Radio,
  Menu,
  X,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    {
      href: '/tournaments',
      label: 'Tournaments',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      href: '/live',
      label: 'Live Matches',
      icon: <Radio className="w-4 h-4 text-secondary" />,
      badge: <Badge variant="live" size="sm">LIVE</Badge>,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-primary-900 text-white shadow-md border-b border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-white font-extrabold shadow-sm group-hover:bg-secondary-600 transition-colors">
                🏏
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white leading-none">
                  CRICKET<span className="text-secondary-400">HUB</span>
                </span>
                <span className="text-[10px] text-primary-200 tracking-wider uppercase font-semibold">
                  Tournament Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-primary-800 text-white font-semibold'
                        : 'text-primary-100 hover:text-white hover:bg-primary-800/60',
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Right Controls (Auth / Profile) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2">
                  <Avatar name={user.name} size="sm" status="online" />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-white">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-primary-200 uppercase font-medium">
                      {user.role}
                    </span>
                  </div>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/organizer">
                    <Button variant="outline" size="sm" className="bg-primary-800 text-white border-primary-700 hover:bg-primary-700">
                      Organizer Portal
                    </Button>
                  </Link>
                )}
                {user.role === 'SUPER_ADMIN' && (
                  <Link href="/super-admin">
                    <Button variant="secondary" size="sm">
                      Super Admin
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-100 hover:text-white hover:bg-primary-800"
                    leftIcon={<LogIn className="w-4 h-4" />}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<UserPlus className="w-4 h-4" />}
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-primary-800 p-2"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-950 border-t border-primary-800 px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-primary-100 hover:text-white hover:bg-primary-800"
              >
                <div className="flex items-center gap-2">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.badge}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-primary-800/70 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Avatar name={user.name} size="sm" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-primary-300">{user.email}</p>
                  </div>
                </div>
                <Badge variant="secondary" size="sm">{user.role}</Badge>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth size="sm" className="text-white border-primary-700 bg-primary-900">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" fullWidth size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
