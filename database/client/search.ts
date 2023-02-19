import { BlockData, Index, Range, SearchQuery } from "../core/types.ts";

export type Search = (index: Index, data: BlockData, query: SearchQuery) => string[]

const search: Search = (index, data, query) => {
  const length = query.length;
  const indexArea = index[length];
  
  // presume all words
  let within: Range[] = [[0, Infinity]];
  const result = [];

  for(const [depth,letter] of query.entries()) {
    if(!letter) continue;
    
    let ranges = indexArea[depth][letter];

    if(within.length) {
      // reduce possible ranges, based on the new range being in the previous
      ranges = ranges.filter(
        range => within.some(boundary =>  range[0] >= boundary[0] && range[1] <= boundary[1])
      )
    }

    within = ranges;
    result.push(ranges);
  }

  return result[result.length-1].map(r => {
    const out: string[] = [];
    
    for(let i = r[0]; i <= r[1]; i++) {
      out.push(data[length][i])
    }

    return out;
  }).flat();
}

export default search;