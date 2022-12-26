import { useState } from 'react';
import { Link } from 'react-router-dom';
import IssuesList from '../components/IssuesList';
import LabelList from '../components/LabelList';
import { StatusSelect } from '../components/StatusSelect';

export default function Issues() {
  const [labels, setLabels] = useState([]);
  const [status, setStatus] = useState('');
  const [pageNum, setPageNum] = useState(1);

  return (
    <div>
      <main>
        <section>
          <h1>Issues</h1>
          <IssuesList
            labels={labels}
            status={status}
            pageNum={pageNum}
            setPageNum={setPageNum}
          />
        </section>
        <aside>
          <LabelList
            selected={labels}
            toggle={(newLabel) =>
              setLabels((labelsState) => {
                labelsState.includes(newLabel)
                  ? labelsState.filter((label) => label !== newLabel)
                  : labelsState.concat(newLabel);

                setPageNum(1);
              })
            }
          />
          <StatusSelect
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPageNum(1);
            }}
          />
          <hr />
          <Link className="button" to="/add">
            Add Issue
          </Link>
        </aside>
      </main>
    </div>
  );
}
