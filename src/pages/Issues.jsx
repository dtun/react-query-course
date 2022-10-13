import { useState } from 'react';
import IssuesList from '../components/IssuesList';
import LabelList from '../components/LabelList';

export default function Issues() {
  const [labels, setLabels] = useState([]);

  return (
    <div>
      <main>
        <section>
          <h1>Issues</h1>
          <IssuesList labels={labels} />
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
        </aside>
      </main>
    </div>
  );
}
