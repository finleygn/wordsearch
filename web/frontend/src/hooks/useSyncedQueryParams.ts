import { useLocation, useNavigate } from "react-router-dom";

type Params<K extends string> = Record<K, string>;

const useSyncedQueryParams = <K extends string[]>(keys: K): {
  params: Params<typeof keys[number]>,
  sync: (kv: Record<string, string>) => void;
 } => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);

  const params = keys.reduce(
    (acc, key) => {
      if(query.has(key)) {
        return { ...acc, [key]: query.get(key) }
      }
      return acc;
    },
    {}
  ) as Params<typeof keys[number]>;
  
  const sync = (kv: Record<string, string>) => {
    const newParams: Record<string, string> = { ...params, ...kv };

    const newUrlSearchParams = new URLSearchParams();
    for(const [key, value] of Object.entries(newParams)) {
      newUrlSearchParams.set(key, value);
    }

    navigate({
      pathname: location.pathname,
      hash: location.hash,
      search: newUrlSearchParams.toString(),
    })
  }

  return {
    params,
    sync,
  }
}

export default useSyncedQueryParams;