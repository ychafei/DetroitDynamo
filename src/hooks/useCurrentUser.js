import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const me = await base44.auth.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const isAdmin = user?.role === 'admin';
  const isSuperAdmin = user?.is_super_admin === true;
  const isCoach = user?.role === 'coach' || isAdmin;

  return { user, loading, isAdmin, isSuperAdmin, isCoach, refetch: fetchUser };
}