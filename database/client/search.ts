import { BlockData, Index, Range, SearchQuery } from "../core/types.ts";

export type Search = (index: Index, data: BlockData, query: SearchQuery) => string[]

const search: Search = (index, data, query) => {
  const length = query.length;
  const indexArea = index[length];
  
  let within: Range[] = [];
  const result = []

  for(const [depth,letter] of query.entries()) {
    if(!letter) continue;
    
    let ranges = indexArea[depth][letter];

    if(within.length) {
      ranges = ranges.filter(range => within.some(boundary =>  range[0] >= boundary[0] && range[1] <= boundary[1]))
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