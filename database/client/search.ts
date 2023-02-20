import { BlockData, Index, Range, SearchQuery } from "../core/types.ts";

export type Search = (index: Index, data: BlockData, query: SearchQuery) => string[]

/**
 * Ideas for speedup,
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
  const indexArea = index[query.length];

  if(!data[query.length]) return [];

  // Current possible words
  let bounds: Range[] = [
    [0, data[query.length].length]
  ];

  // Reduce bounds based on each query entry
  for(const [position, character] of query.entries()) {
    if(!character) continue;

    // There are no available words for this character.
    if(
      !indexArea[position][character] ||
      !indexArea[position][character].length
    ) return [];

    // Select possible ranges
    let ranges = indexArea[position][character];
    
    // Remove any ranges outside of boundaries (this is inefficient)
    ranges = ranges.filter(
      range => bounds.some(boundary => inBoundary(range, boundary))
    )

    // If no ranges available return nothing
    if(!ranges.length) return [];
    else bounds = ranges;
  }

  // Retrieve indexes from data
  let out: string[] = [];

  for(const bound of bounds) {
    if(Array.isArray(bound)) {
      out = out.concat(data[query.length].slice(bound[0]+1, bound[1]+1))
    } else {
      out = out.concat(data[query.length].slice(bound, bound+1))
    }
  }

  return out;
}

export default search;