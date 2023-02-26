import { useQuery } from "@tanstack/react-query";

export type Dataset = {
  name: string;
  words: number;
}

const useDatasets = () => {
  const query = useQuery<Dataset[]>({
    queryKey: ['datasets'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/dataset')
      if (!response.ok) { throw new Error() };
      return response.json()
    },
  });

  return {
    status: query.status,
    error: query.error,
    data: query.data,
  }
}

export default useDatasets;