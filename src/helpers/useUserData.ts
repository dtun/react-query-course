import { useQuery } from 'react-query';
import { fetchWithError } from './fetchWithError';

export function useUserData(userId) {
  const usersData = useQuery(
    ['users', userId],
    () => fetchWithError(`/api/users/${userId}`),
    { enabled: Boolean(userId) }
  );

  return usersData;
}
