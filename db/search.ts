import { Index, Range } from './index.ts';

const rawIndex = await Deno.readTextFile("./db/out.json");
const index = JSON.parse(rawIndex) as Index;

const rawData = await Deno.readTextFile("./db/block.json");
const data = JSON.parse(rawData);

type Constraint = string | null

type SearchQuery = {
  length: number;
  constraint: Constraint[]
}

function search({ length, constraint }: SearchQuery) {
  console.log("SEARCHING", length, constraint)
  const indexArea = index[length];
  let within: Range[] = [];
  const result = []

  for(const [depth,letter] of constraint.entries()) {
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