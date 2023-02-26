import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import useDatasets from "../hooks/useDatasets";
import useSyncedQueryParams from "../hooks/useSyncedQueryParams";
import useWords from "../hooks/useWords";

interface IQueryContext {
  params: {
    word: string,
    dataset: string,
  }
  datasets: ReturnType<typeof useDatasets>,
  words: ReturnType<typeof useWords>,
  query: (word: string, dataset: string) => void;
}

const queryContext = React.createContext<IQueryContext>({} as IQueryContext)

function QueryProvider({ children }: React.PropsWithChildren) {
  const queryParams = useSyncedQueryParams(['w','d']);

  const wordP = queryParams.params.w;
  const datasetP = queryParams.params.d;

  const datasets = useDatasets();
  const words = useWords(
    wordP,
    datasetP,
  );

  const query = useCallback((word: string, dataset: string) => {
    queryParams.sync({
      w: word,
      d: dataset,
    });
  }, []);

  return (
    <queryContext.Provider value={{
      params: {
        word: wordP,
        dataset: datasetP,
      },
      query,
      datasets,
      words,
    }}>
      {children}
    </queryContext.Provider>
  )
}

export const useWordQuery = () => useContext(queryContext);

export default QueryProvider;