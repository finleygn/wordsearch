import { parse } from "https://deno.land/std@0.175.0/flags/mod.ts";
import { readLines } from "https://deno.land/std@0.175.0/io/mod.ts";
import * as fs from "https://deno.land/std@0.177.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.177.0/path/mod.ts";
import createBlockData from '../core/blockData.ts';
import createIndex from '../core/index.ts';

const flags = parse(Deno.args, {
  string: ["words", "outdir", "name"],
  default: {
    outdir: "./words",
    name: "dictionary"
  },
});

async function getReader() {
  let reader
  if(flags.words) {
    reader = await Deno.open(flags.words);
  } else {
    reader = Deno.stdin;
  }
  return reader;
}

async function readWords() {
  const reader = await getReader();

  const words = [];
  for await (const line of readLines(reader)) {
    if(!line) continue;
    words.push(line.trim());
  }
  
  if(!words) throw new Error("No words given");
  return words;
}

const words = await readWords();
const blockData = createBlockData(words);
const index = createIndex(blockData);

const meta = {
  name: flags.name,
  words: words.length
}

await fs.ensureDir(flags.outdir);
await Promise.all([
  Deno.writeTextFile(path.join(flags.outdir, "block"), JSON.stringify(blockData)),
  Deno.writeTextFile(path.join(flags.outdir, "index"), JSON.stringify(index)),
  Deno.writeTextFile(path.join(flags.outdir, "meta.json"), JSON.stringify(meta, null,2)),
]);

console.log("Created index & block data.");


