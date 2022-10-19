import { relativeDate } from '../helpers/relativeDate';
import { useUserData } from '../helpers/useUserData';

export function Comment({ comment, createdBy, createdDate }) {
  const userQuery = useUserData(createdBy);

  if (userQuery.isLoading) {
    return (
      <div>
        <div className="comment-header">Loading...</div>
      </div>
    );
  }

  return (
    <div className="comment">
      <img src={userQuery.data.profilePictureUrl} alt="Commenter Avatar" />
      <div>
        <div className="comment-header">
          <span>{userQuery.data?.name}</span> commented{' '}
          <span>{relativeDate(createdDate)}</span>
        </div>
        <div className="comment-body">{comment}</div>
      </div>
    </div>
  );
}
