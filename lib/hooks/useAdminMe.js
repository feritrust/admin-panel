import { useQuery } from '@tanstack/react-query';
import { fetchAdminMe } from '../api/admin';

export function useAdminMe() {
  return useQuery({
    queryKey: ['adminMe'],
    queryFn: fetchAdminMe,
    retry: false,
  });
}
