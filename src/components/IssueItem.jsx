import { Link } from 'react-router-dom';
import { GoIssueOpened, GoIssueClosed, GoComment } from 'react-icons/go';
import { useQueryClient } from 'react-query';
import { relativeDate } from '../helpers/relativeDate';
import { useUserData } from '../helpers/useUserData';
import { fetchWithError } from '../helpers/fetchWithError';
import { Label } from './Label';

export function IssueItem({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status,
}) {
  const assigneeUser = useUserData(assignee);
  const createdByUser = useUserData(createdBy);
  const queryClient = useQueryClient();

  return (
    <li
      onMouseEnter={() => {
        queryClient.prefetchQuery(['issues', String(number)], () =>
          fetchWithError(`/api/issues/${issueNumber}`)
        );
        queryClient.prefetchQuery(['issues', String(number), 'comments'], () =>
          fetchWithError(`/api/issues/${number}/comments`)
        );
      }}
    >
      <div>
        {status === 'done' || status === 'cancelled' ? (
          <GoIssueClosed style={{ color: 'red' }} />
        ) : (
          <GoIssueOpened style={{ color: 'green' }} />
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issue/${number}`}>{title}</Link>
          {labels.map((label) => (
            <Label key={label} label={label} />
          ))}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)}{' '}
          {createdByUser.isSuccess ? `by ${createdByUser.data.name}` : null}
        </small>
      </div>
      {assignee && assigneeUser.isSuccess ? (
        <img
          alt={`Assigned to ${assigneeUser.data.name}`}
          className="assigned-to"
          src={assigneeUser.data.profilePictureUrl}
        />
      ) : null}
      <span className="comment-count">
        {commentCount > 0 ? (
          <>
            <GoComment />
            {commentCount}
          </>
        ) : null}
      </span>
    </li>
  );
}
