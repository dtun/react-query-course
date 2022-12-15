const possibleStatus = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To-do' },
  { id: 'inProgress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
  { id: 'cancelled', label: 'Cancelled' },
];
export function StatusSelect({ value, onChange, noEmptyOption = false }) {
  return (
    <>
      <h3>Status</h3>
      <select className="status-select" value={value} onChange={onChange}>
        {noEmptyOption ? null : (
          <option value="">Select a status to filter</option>
        )}
        {possibleStatus.map((status) => (
          <option key={status.id} value={status.id}>
            {status.label}
          </option>
        ))}
      </select>
    </>
  );
}
