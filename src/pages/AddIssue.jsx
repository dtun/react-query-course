import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

export default function AddIssue() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addIssue = useMutation(
    (issueBody) =>
      fetch('/api/issues', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(issueBody),
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['issues'], { exact: true });
        queryClient.setQueryData(['issues', String(data.number)], data);
        navigate(`/issue/${data.number}`);
      },
    }
  );

  return (
    <div className="add-issue">
      <h2>Add Issue</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (addIssue.isLoading) return;

          addIssue.mutate({
            comment: e.target.comment.value,
            title: e.target.title.value,
          });
        }}
      >
        <label htmlFor="title">Title</label>
        <input type="text" id="title" placeholder="Title" name="title" />
        <label htmlFor="comment">Comment</label>
        <input
          type="textarea"
          id="comment"
          placeholder="Comment"
          name="comment"
        />
        <button disabled={addIssue.isLoading} type="submit">
          {addIssue.isLoading ? 'Adding Issue...' : 'Add Issue'}
        </button>
      </form>
    </div>
  );
}
