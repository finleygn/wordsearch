import {readLines} from "https://deno.land/std@0.177.0/io/mod.ts";
import {validateWord} from '../lib/validate.ts';
import IndexBuilder from './index.ts';

const exists = async (filename: string): Promise<boolean> => {
  try {
    await Deno.stat(filename);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    } else {
      // unexpected error, maybe permissions, pass it along
      throw error;
    }
  }
};

async function createBlockData(from: Deno.File) {
  const lengths: Record<number, string[]> = {};
  
  for await(const line of readLines(from)) {
    try { validateWord(line) } catch(e) { continue }
  
    if(!lengths[line.length]) {
      lengths[line.length] = []
    }
  
    lengths[line.length].push(line.toLowerCase());
  }
  
  const encoder = new TextEncoder();
  const output = Object.entries(lengths).reduce((acc, [k,v]) => ({ ...acc, [k]: Array.from(v).sort() }), {});
  const data = encoder.encode(JSON.stringify(output));
  await Deno.writeFile('block.json', data);
}

const blockDataExists = await exists("block.json");

if(!blockDataExists) {
  console.log("no cache, creating");
  const input = await Deno.open(".wordlist", { read: true })
  await createBlockData(input);
  input.close();
}


const raw = await Deno.readTextFile("block.json");
const data = JSON.parse(raw);

// Build range index

const indexBuilder = new IndexBuilder();

for(const l of Object.keys(data)) {
  const words = data[l];
  indexBuilder.addWords(Number(l), words);
}

await Deno.writeTextFile("out.json", JSON.stringify(indexBuilder.getIndex()));

