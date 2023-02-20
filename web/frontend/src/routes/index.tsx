import QueryProvider, { useWordQuery } from "../providers/QueryProvider";

function IndexRoute() {
  const q = useWordQuery();
  return (
    <pre>
      {JSON.stringify(q)}
    </pre>
  )
}

export default () => (
  <QueryProvider>
    <IndexRoute />
  </QueryProvider>
);