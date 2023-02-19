import { BlockData } from "./types.ts";

export type CreateBlockData = (words: string[]) => BlockData;

const createBlockData: CreateBlockData = (words) => {
  const lengths: Record<number, string[]> = {};
  
  for (const word of words) {
    if(!lengths[word.length]) {
      lengths[word.length] = []
    }
  
    lengths[word.length].push(word.toLowerCase());
  }

  return Object.entries(lengths)
    .reduce(
      (acc, [k,v]) => ({
        ...acc,
        [k]: Array.from(v).sort()
      }),
      {}
    );
}

export default createBlockData;