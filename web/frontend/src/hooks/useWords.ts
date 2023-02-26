import { useQuery } from "@tanstack/react-query";

type Words = {
  results: string[],
  meta: {
    took: number,
  }
}

const useWords = (word: string, dataset: string) => {
  console.log(word,dataset)
  
  const query = useQuery<Words>({
    queryKey: ['words', word, dataset],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000?word='+word+"&dataset="+dataset);
      if (!response.ok) { throw new Error() };
      return response.json();
    },
    enabled: !!(word && dataset),
  });

  return {
    status: query.status,
    error: query.error,
    data: query.data,
  }
}

export default useWords;