import { BlockData, Index } from "./types.ts";

export type CreateIndex = (blockData: BlockData) => Index;

const createIndex: CreateIndex = (blockData: BlockData): Index => {
  const index: Index = {};

  for(const [lengthstr, words] of Object.entries(blockData)) {
    const length = Number(lengthstr);

    if(!index[length]) index[length] = [];

    for(let d = 0; d < length; d++) {
      index[length][d] = {};

      let lastChar = ""
      let start = 0;

      for(const [i,w] of words.entries()) {
        const c = w[d];

        if(!index[length][d][c]) index[length][d][c] = []

        if(lastChar !== c && lastChar) {
          // could reduce the size of this by storing the first index then the diff?
          index[length][d][lastChar].push(start === i-1 ? start : [start, i-1]);
          start = i;
        }

        lastChar = c;
      }
    }
  }

  return index;
}

export default createIndex;