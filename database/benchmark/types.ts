export interface BenchmarkResult {
  id: string,
  inputSize: number,
  outputSize: {
    index: number,
    block: number,
  },
  compileTime: {
    block: number,
    index: number,
  },
  searchTime: number[],
}

export interface BenchmarkRun {
  time: string;
  version: string;
  results: BenchmarkResult[]
}

