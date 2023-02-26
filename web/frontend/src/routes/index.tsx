import { useState } from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import Input from "../components/Input";
import QueryProvider, { useWordQuery } from "../providers/QueryProvider";


function IndexRoute() {
  const q = useWordQuery();

  const [currentWord, setCurrentWord] = useState(
    q.params.word,
  );
  const [currentDataset, setCurrentDataset] = useState(
    q.params.dataset,
  );

  const run = () => q.query(
    currentWord,
    currentDataset,
  );

  return (
    <>
      <div>
        Select dataset:
        {q.datasets.status === 'loading' 
          ? <h1>loading datasets</h1>
          : q.datasets.data?.map(set => <button onClick={() => setCurrentDataset(set.name)}>{set.name}</button>)
        }
      </div>

      <br />
      <hr />
      <br />

      <Input value={currentWord} onChange={setCurrentWord} />

      <button onClick={() => run()}>Search</button>
      <pre>
        {JSON.stringify(q, null, 2)}
      </pre>
    </>
  )
}

export default () => (
  <QueryProvider>
    <IndexRoute />
  </QueryProvider>
);