import { useQuery } from 'react-query';
import { fetchWithError } from './fetchWithError';

export function useUserData(userId) {
  const usersData = useQuery(
    ['users', userId],
    ({ signal }) => fetchWithError(`/api/users/${userId}`, { signal }),
    { enabled: Boolean(userId), staleTime: 1000 * 60 * 5 }
  );

  return usersData;
}
