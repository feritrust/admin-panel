import { useQuery } from '@tanstack/react-query';
import { fetchAllUsers } from '../api/admin';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    retry: false,
  });
}
