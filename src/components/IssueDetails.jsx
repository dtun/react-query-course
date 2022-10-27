import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchWithError } from '../helpers/fetchWithError';
import { Comment } from './Comment';
import { IssueHeader } from './IssueHeader';

function useIssueData(issueNumber) {
  return useQuery(['issues', issueNumber], () => {
    return fetchWithError(`/api/issues/${issueNumber}`);
  });
}

function useIssueComments(issueNumber) {
  return useQuery(['issues', issueNumber, 'comments'], () => {
    return fetchWithError(`/api/issues/${issueNumber}/comments`);
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
            <aside></aside>
          </main>
        </>
      )}
    </div>
  );
}
