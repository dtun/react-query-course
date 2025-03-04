import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { fetchWithError } from '../helpers/fetchWithError';
import { IssueItem } from './IssueItem';
import { Loader } from './Loader';

export default function IssuesList({ labels, status, pageNum, setPageNum }) {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState('');
  const issuesQuery = useQuery(
    ['issues', { labels, status, pageNum }],
    async ({ signal }) => {
      const statusString = status ? `&status=${status}` : '';
      const labelsString = labels
        ?.map((label) => `labels[]=${label}`)
        .join('&');
      const paginationString = pageNum ? `&page=${pageNum}` : '';
      const results = await fetchWithError(
        `/api/issues?${labelsString}${statusString}${paginationString}`,
        {
          signal,
        }
      );

      results.forEach((issue) => {
        queryClient.setQueryData(['issues', String(issue.number)], issue);
      });

      return results;
    },
    { keepPreviousData: true }
  );
  const searchQuery = useQuery(
    ['issues', 'search', searchValue],
    ({ signal }) =>
      fetchWithError(`/api/search/issues?q=${searchValue}`, { signal }),
    { enabled: searchValue.length > 0 }
  );

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearchValue(e.target.elements.search.value);
        }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="Search"
          name="search"
          id="search"
          onChange={(e) => {
            if (e.target.value.length === 0) {
              setSearchValue('');
            }
          }}
        ></input>
      </form>
      <h2>
        Issues List {issuesQuery.fetchStatus === 'fetching' ? <Loader /> : null}
      </h2>
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : issuesQuery.isError ? (
        <p>{issuesQuery.error.message}</p>
      ) : searchQuery.fetchStatus === 'idle' &&
        searchQuery.isLoading === true ? (
        <>
          <ul className="issues-list">
            {issuesQuery.data.map((issue) => (
              <IssueItem
                key={issue.id}
                title={issue.title}
                number={issue.number}
                assignee={issue.assignee}
                commentCount={issue.comments.length}
                createdBy={issue.createdBy}
                createdDate={issue.createdDate}
                labels={issue.labels}
                status={issue.status}
              />
            ))}
          </ul>
          <div className="pagination">
            <button
              disabled={pageNum === 1}
              onClick={() => {
                const update = pageNum - 1;
                if (update > 0) {
                  setPageNum(update);
                }
              }}
            >
              Previous
            </button>
            <p>
              Page {pageNum} {issuesQuery.isFetching ? '...' : ''}
            </p>
            <button
              disabled={
                issuesQuery.data?.length === 0 || issuesQuery.isPreviousData
              }
              onClick={() => {
                const update = pageNum + 1;
                if (
                  issuesQuery.data?.length !== 0 &&
                  !issuesQuery.isPreviousData
                ) {
                  setPageNum(update);
                }
              }}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchQuery.data.count} Results</p>
              <ul className="issues-list">
                {searchQuery.data.items.map((issue) => (
                  <IssueItem
                    key={issue.id}
                    title={issue.title}
                    number={issue.number}
                    assignee={issue.assignee}
                    commentCount={issue.comments.length}
                    createdBy={issue.createdBy}
                    createdDate={issue.createdDate}
                    labels={issue.labels}
                    status={issue.status}
                  />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
