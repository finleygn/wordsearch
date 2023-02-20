// Benchmark utility
// used to track perf over time

import * as path from 'https://deno.land/std@0.177.0/path/mod.ts';
import { BenchmarkRun } from './types.ts';
import createBlockData from '../core/blockData.ts'
import createIndex from '../core/index.ts'
import search from '../client/search.ts'

const directory = {
  lists: path.join(
    path.dirname(path.fromFileUrl(import.meta.url)),
    "./lists"
  ),
  results: path.join(
    path.dirname(path.fromFileUrl(import.meta.url)),
    "./results"
  )
}

async function getCodeVersion() {
  const decoder = new TextDecoder();
  const tagCmd = Deno.run({
    cmd: ["git", "describe", "--tags", '--abbrev=0'],
    stdout: "piped"
  });
  const commitCmd = Deno.run({
    cmd: ["git", "rev-parse", "--short", "HEAD"],
    stdout: "piped"
  });
  const tag = await tagCmd.output();
  const commit = await commitCmd.output();
  tagCmd.close();
  commitCmd.close();
  return `${decoder.decode(tag).trim()}@${decoder.decode(commit).trim()}`
}

function performanceExec<T>(run: () => T, times = 100) {
  const results = [];

  for(let r = 0; r < times; r++)  {
    performance.mark(`${r}-s`)
    run()
    performance.mark(`${r}-e`)
    results.push(performance.measure(`${r}`, `${r}-s`, `${r}-e`).duration)
  }

  return {
    output: run(),
    time: results.reduce((a,b) => a+b, 0) / results.length
  }
}

async function run() {
  const version = await getCodeVersion();
  const unixTime = new Date().toISOString();

  const benchmarkRun: BenchmarkRun = {
    version: version,
    time: unixTime,
    results: [],
  }

  for await(const list of Deno.readDir(directory.lists)) {
    const inputFile = path.join(directory.lists, list.name);

    const inputFileStat =  await Deno.stat(inputFile);
    const listContent = await Deno.readTextFile(inputFile);
    
    const words = listContent.split("\n");

    console.log("Measuring", list.name)

    const blockCreation = performanceExec(
      () => createBlockData(words)
    );
    const indexCreation = performanceExec(
      () => createIndex(blockCreation.output)
    );

    const blockFile = await Deno.makeTempFile();
    const indexFile = await Deno.makeTempFile();
    await Deno.writeTextFile(blockFile, JSON.stringify(blockCreation.output))
    await Deno.writeTextFile(indexFile, JSON.stringify(indexCreation.output))
    const blockFileStat = await Deno.stat(blockFile)
    const indexFileStat = await Deno.stat(indexFile)

    const searches = [];

    for(let i = 0; i < 10; i++) {
      const result = performanceExec(
        () => search(
          indexCreation.output,
          blockCreation.output,
          ["a", ...new Array(i).fill(0).map(_ => null)]
        )
      );
      searches.push(result.time)
    }

    benchmarkRun.results.push({
      id: list.name,
      inputSize: inputFileStat.size,
      compileTime: {
        block: blockCreation.time,
        index: indexCreation.time,
      },
      outputSize: {
        block: blockFileStat.size,
        index: indexFileStat.size,
      },
      searchTime: searches,
    });
  }

  await Deno.writeTextFile(
    path.join(directory.results, `${benchmarkRun.time}--${benchmarkRun.version}.json`),
    JSON.stringify(benchmarkRun, null, 2)
  )
}

await run();




