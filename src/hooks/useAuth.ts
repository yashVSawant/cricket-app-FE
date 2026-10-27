import { useAppSelector } from './redux';
import { Role } from '@/types';

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  const hasRole = (...roles: Role[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isPlayer = user?.role === 'PLAYER';
  const isScorer = user?.role === 'SCORER';
  const isAdmin = user?.role === 'ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    isPlayer,
    isScorer,
    isAdmin,
    isSuperAdmin,
  };
}
