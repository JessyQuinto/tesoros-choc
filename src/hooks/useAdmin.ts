import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/services/admin.service';
import { UserProfile } from '@/types/user.types';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveUser = async (userId: string) => {
    try {
      setError(null);
      await adminService.approveUser(userId);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isApproved: true } : user
      ));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      setError(null);
      await adminService.rejectUser(userId);
      // Después de rechazar, puede que queramos refrescar la lista
      await fetchUsers();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      setError(null);
      await adminService.suspendUser(userId);
      await fetchUsers(); // Refrescar para obtener el estado actualizado
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  };

  const reactivateUser = async (userId: string) => {
    try {
      setError(null);
      await adminService.reactivateUser(userId);
      await fetchUsers(); // Refrescar para obtener el estado actualizado
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    approveUser,
    rejectUser,
    suspendUser,
    reactivateUser,
    refetch: fetchUsers
  };
};

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuyers: 0,
    totalSellers: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getSystemStats();
      setStats(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};
