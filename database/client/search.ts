import { BlockData, Index, Range, SearchQuery } from "../core/types.ts";

export type Search = (index: Index, data: BlockData, query: SearchQuery) => string[]

/**
 * Ideas for speedup,
 * - stop going over ranges when bigger than max of last result
 * - binary search ranges?
 */
const fromRange = (range: Range): [number,number] => {
  if(Array.isArray(range)) {
    return range;
  }
  return [range,range]
}

const inBoundary = (r1: Range, r2: Range): boolean => {
  const rf1 = fromRange(r1);
  const rf2 = fromRange(r2);

  return rf1[1] >= rf2[0] && rf1[1] <= rf2[1]
}

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
        range => within.some(boundary => inBoundary(range, boundary))
      )
    }

    within = ranges;
    result.push(ranges);
  }

  return result[result.length-1].map(r => {
    const out: string[] = [];
    const r2 = fromRange(r)
    
    for(let i = r2[0]; i <= r2[1]; i++) {
      out.push(data[length][i])
    }

    return out;
  }).flat();
}

export default search;