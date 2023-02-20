import React, { useContext, useEffect, useMemo, useReducer, useState } from "react"
import { useLocation } from "react-router-dom";

interface IQueryContext {
  characters: string[],
  results: string[],
  status: "idle" | "loading" | "error" | "success"
}

const queryContext = React.createContext<IQueryContext>({} as IQueryContext)

function QueryProvider({ children }: React.PropsWithChildren) {
  const location = useLocation()

  const query = new URLSearchParams(location.search);
  const word = query.get("w");

  const [state, setState] = useState<IQueryContext>({
    characters: word?.split("") || [],
    results: [],
    status: word ? 'idle' : 'loading'
  });

  useEffect(() => {
    setState(s => ({
      ...s,
      characters: word?.split("") || [],
      status: word ? 'idle' : 'loading'
    }));

    fetch("http://127.0.0.1:8000?w=" + word)
      .then(async (response) => {
        const data = await response.json()
        setState((s) => ({ ...s, results: data, status: 'success' }))
      })
      .catch(() => {
        setState((s) => ({ ...s, status: 'error' }))
      })
  }, [word]);

  return (
    <queryContext.Provider value={state}>
      {children}
    </queryContext.Provider>
  )
}

export const useWordQuery = () => useContext(queryContext);

export default QueryProvider;