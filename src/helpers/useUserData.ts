import { useQuery } from 'react-query';
import { fetchWithError } from './fetchWithError';

export function useUserData(userId) {
  const usersData = useQuery(
    ['users', userId],
    () => fetchWithError(`/api/users/${userId}`),
    { enabled: Boolean(userId), staleTime: 1000 * 60 * 5 }
  );

  return usersData;
}
