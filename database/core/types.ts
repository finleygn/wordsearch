// Index Structure
export type Range = [number,number] | number;

interface LetterRange {
  [letter: string]: Range[];
}

interface DepthIndex {
  [depth: number]: LetterRange;
}

export interface Index {
  [letterCount: number]: DepthIndex;
}

// Block data
export interface BlockData {
  [letterCount: number]: string[];
}

// Search
export type Constraint = string | null
export type SearchQuery = Constraint[];