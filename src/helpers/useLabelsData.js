import { useQuery } from 'react-query';
import { fetchWithError } from './fetchWithError';
import { defaultLabels } from './defaultData';

export function useLabelsData() {
  const labelsQuery = useQuery(
    ['labels'],
    () => fetchWithError('/api/labels'),
    { placeholderData: defaultLabels }
  );

  return labelsQuery;
}
