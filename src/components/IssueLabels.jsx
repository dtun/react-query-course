import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { GoGear } from 'react-icons/go';
import { useLabelsData } from '../helpers/useLabelsData';

export function IssueLabels({ labels, issueNumber }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const labelsQuery = useLabelsData();
  const queryClient = useQueryClient();
  const setLabels = useMutation(
    (labelId) => {
      const newLabels = labels.includes(labelId)
        ? labels.filter((id) => id !== labelId)
        : [...labels, labelId];

      return fetch(`/api/issues/${issueNumber}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ labels: newLabels }),
      }).then((res) => res.json());
    },
    {
      onMutate: (labelId) => {
        const oldLabels = queryClient.getQueryData([
          'issues',
          issueNumber,
        ]).labels;
        const newLabels = labels.includes(labelId)
          ? labels.filter((id) => id !== labelId)
          : [...labels, labelId];

        queryClient.setQueryData(['issues', issueNumber], (data) => ({
          ...data,
          labels: newLabels,
        }));

        return function rollback() {
          queryClient.setQueryData(['issues', issueNumber], (data) => ({
            ...data,
            labels: oldLabels,
          }));
        };
      },
      onError(_arg1, _arg2, rollback) {
        rollback();
      },
      onSettled() {
        queryClient.invalidateQueries(['issues', issueNumber], { exact: true });
      },
    }
  );

  return (
    <div className="issue-options">
      <div>
        <span>Labels</span>
        {labelsQuery.isLoading
          ? null
          : labels.map((label) => {
              const labelObject = labelsQuery.data.find(
                (queryLabel) => queryLabel.id === label
              );
              return labelObject ? (
                <span
                  className={`label ${labelObject.color}`}
                  key={labelObject.id}
                >
                  {labelObject.name}
                </span>
              ) : null;
            })}
      </div>
      <GoGear
        onClick={() => {
          if (!labelsQuery.isLoading) {
            setMenuOpen((open) => !open);
          }
        }}
      />
      {menuOpen ? (
        <div className="picker-menu labels">
          {labelsQuery.data?.map((label) => {
            const selected = labels.includes(label.id);
            return (
              <div
                key={label.id}
                className={`${selected ? 'selected' : ''}`}
                onClick={() => {
                  setLabels.mutate(label.id);
                }}
              >
                <span
                  className={`label-dot`}
                  style={{ backgroundColor: label.color }}
                ></span>
                {label.name}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
