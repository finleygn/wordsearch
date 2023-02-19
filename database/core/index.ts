import { BlockData, Index } from "./types.ts";

export type CreateIndex = (blockData: BlockData) => Index;

const createIndex: CreateIndex = (blockData: BlockData): Index => {
  const index: Index = {};

  for(const [lengthstr, words] of Object.entries(blockData)) {
    const length = Number(lengthstr);

    if(!index[length]) index[length] = [];

    // For every letter depth
    for(let d = 0; d < length; d++) {
      index[length][d] = {};

      // Every word

      let lastChar: string = ""
      let start = 0;

      for(const [i,w] of words.entries()) {
        const c = w[d];

        // Create new range list
        if(!index[length][d][c]) index[length][d][c] = []

        // Onto new char
        if(lastChar !== c && lastChar) {
          index[length][d][lastChar].push([start, i-1]);
          start = i;
        }

        lastChar = c;
      }
    }
  }

  return index;
}

export default createIndex;