'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}

export interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  title,
  isCollapsed = false,
  onToggleCollapse,
  className,
}) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'h-full bg-white border-r border-gray-200 transition-all duration-200 flex flex-col justify-between shrink-0 select-none',
        isCollapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      <div>
        {/* Header / Title */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 h-16">
          {!isCollapsed && title && (
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider truncate">
              {title}
            </h4>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-1 text-gray-400 hover:text-gray-700 ml-auto"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer group',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  isCollapsed && 'justify-center px-2',
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-gray-600',
                  )}
                >
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}

                {!isCollapsed && item.badge && <div>{item.badge}</div>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer subtle brand mark */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100 text-[11px] text-gray-400 text-center">
          CricketHub Engine v1.0
        </div>
      )}
    </aside>
  );
};
