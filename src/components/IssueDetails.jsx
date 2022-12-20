import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchWithError } from '../helpers/fetchWithError';
import { Comment } from './Comment';
import { IssueAssignment } from './IssueAssignment';
import { IssueHeader } from './IssueHeader';
import { IssueLabels } from './IssueLabels';
import { IssueStatus } from './IssueStatus';

function useIssueData(issueNumber) {
  return useQuery(['issues', issueNumber], ({ signal }) => {
    return fetchWithError(`/api/issues/${issueNumber}`, { signal });
  });
}

function useIssueComments(issueNumber) {
  return useQuery(['issues', issueNumber, 'comments'], ({ signal }) => {
    return fetchWithError(`/api/issues/${issueNumber}/comments`, { signal });
  });
}

export default function IssueDetails() {
  const { number } = useParams();
  const issueQuery = useIssueData(number);
  const commentsQuery = useIssueComments(number);

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
                commentsQuery.data?.map((comment) => (
                  <Comment key={comment.id} {...comment} />
                ))
              )}
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
