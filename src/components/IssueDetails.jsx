import React from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchWithError } from '../helpers/fetchWithError';
import { useScrollToBottomAction } from '../helpers/useScrollToBottomAction';
import { Comment } from './Comment';
import { IssueAssignment } from './IssueAssignment';
import { IssueHeader } from './IssueHeader';
import { IssueLabels } from './IssueLabels';
import { IssueStatus } from './IssueStatus';
import { Loader } from './Loader';

function useIssueData(issueNumber) {
  return useQuery(['issues', issueNumber], ({ signal }) => {
    return fetchWithError(`/api/issues/${issueNumber}`, { signal });
  });
}

function useIssueComments(issueNumber) {
  return useInfiniteQuery(
    ['issues', issueNumber, 'comments'],
    ({ signal, pageParam = 1 }) => {
      return fetchWithError(
        `/api/issues/${issueNumber}/comments?page=${pageParam}`,
        { signal }
      );
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) {
          return;
        }
        return pages.length + 1;
      },
    }
  );
}

export default function IssueDetails() {
  const { number } = useParams();
  const issueQuery = useIssueData(number);
  const commentsQuery = useIssueComments(number);

  useScrollToBottomAction(document, commentsQuery.fetchNextPage, 100);

  return (
    <div className="issue-details">
      {issueQuery.isLoading ? (
        <p>Loading issue...</p>
      ) : (
        <>
          <IssueHeader {...issueQuery.data} />
          <main>
            <section>
              {commentsQuery.isLoading ? (
                <p>Loading...</p>
              ) : (
                commentsQuery.data?.pages.map((commentPage, index) => (
                  <React.Fragment key={index}>
                    {commentPage.map((comment) => (
                      <Comment key={comment.id} {...comment} />
                    ))}
                  </React.Fragment>
                ))
              )}
              {commentsQuery.isFetchingNextPage ? <Loader /> : null}
            </section>
            <aside>
              <IssueStatus
                status={issueQuery.data.status}
                issueNumber={String(issueQuery.data.number)}
              />
              <IssueAssignment
                assignee={issueQuery.data.assignee}
                issueNumber={String(issueQuery.data.number)}
              />
              <IssueLabels
                labels={issueQuery.data.labels}
                issueNumber={String(issueQuery.data.number)}
              />
            </aside>
          </main>
        </>
      )}
    </div>
  );
}
