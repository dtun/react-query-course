import { useQuery } from "react-query";
import { fetchWithError } from "./fetchWithError";

export function useLabelsData() {
  const labelsQuery = useQuery(['labels'], () => fetchWithError('/api/labels'));

  return labelsQuery;
}
