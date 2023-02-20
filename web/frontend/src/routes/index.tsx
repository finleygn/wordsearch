import { useState } from "react";
import {useLocation} from 'react-router-dom';
import Input from "../components/Input";
import QueryProvider, { useWordQuery } from "../providers/QueryProvider";

function IndexRoute() {
  const q = useWordQuery();
  const location = useLocation();

  const [query, setQuery] = useState(q.characters.join());

  return (
    <pre>
      <Input value={query} onChange={setQuery} />
      <button onClick={() => location.push()}>Search</button>
      {JSON.stringify(q)}
    </pre>
  )
}

export default () => (
  <QueryProvider>
    <IndexRoute />
  </QueryProvider>
);