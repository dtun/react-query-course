import { useState } from 'react';
import IssuesList from '../components/IssuesList';
import LabelList from '../components/LabelList';
import { StatusSelect } from '../components/StatusSelect';

export default function Issues() {
  const [labels, setLabels] = useState([]);
  const [status, setStatus] = useState('');

  return (
    <div>
      <main>
        <section>
          <h1>Issues</h1>
          <IssuesList labels={labels} status={status} />
        </section>
        <aside>
          <LabelList
            selected={labels}
            toggle={(newLabel) =>
              setLabels((labelsState) =>
                labelsState.includes(newLabel)
                  ? labelsState.filter((label) => label !== newLabel)
                  : labelsState.concat(newLabel)
              )
            }
          />
          <StatusSelect
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </aside>
      </main>
    </div>
  );
}
