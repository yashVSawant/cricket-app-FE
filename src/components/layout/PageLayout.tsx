'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from './Navbar';
import { Sidebar, SidebarItem } from './Sidebar';
import { PageHeader, BreadcrumbItem } from './PageHeader';
import { cn } from '@/lib/utils';

export interface PageLayoutProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  sidebarItems?: SidebarItem[];
  sidebarTitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  breadcrumbs,
  actions,
  sidebarItems,
  sidebarTitle,
  maxWidth = '7xl',
  showNavbar = true,
  showFooter = true,
  className,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Top Navbar */}
      {showNavbar && <Navbar />}

      {/* Main Body with optional Sidebar */}
      <div className="flex-1 flex">
        {sidebarItems && (
          <Sidebar
            items={sidebarItems}
            title={sidebarTitle}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}

        <main className="flex-1 flex flex-col min-w-0">
          <div
            className={cn(
              'w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1',
              maxWidthClasses[maxWidth],
              className,
            )}
          >
            {title && (
              <PageHeader
                title={title}
                description={description}
                breadcrumbs={breadcrumbs}
                actions={actions}
              />
            )}
            {children}
          </div>

          {/* Footer */}
          {showFooter && (
            <footer className="mt-auto border-t border-border bg-surface py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary-900">CricketHub</span>
                  <span>• Production-Grade Tournament Engine</span>
                </div>
                <div className="flex items-center gap-6">
                  <Link href="/tournaments" className="hover:text-primary-600 transition-colors">
                    Tournaments
                  </Link>
                  <Link href="/live" className="hover:text-primary-600 transition-colors">
                    Live Scorecards
                  </Link>
                  <Link href="/register" className="hover:text-primary-600 transition-colors font-medium text-primary">
                    Join / Register
                  </Link>
                </div>
              </div>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
};
