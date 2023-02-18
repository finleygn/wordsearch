export type Range = [number,number];

interface LetterRange {
  [letter: string]: Range[];
}

interface DepthIndex {
  [depth: number]: LetterRange;
}

export interface Index {
  [letterCount: number]: DepthIndex;
}

class IndexBuilder {
  private index: Index = {};

  public addWords(wordLength: number, words: string[]) {
    // Add line
    if(!this.index[wordLength]) this.index[wordLength] = [];

    // For every letter depth
    for(let d = 0; d < wordLength; d++) {
      this.index[wordLength][d] = {};

      // Every word

      let lastChar: string = ""
      let start = 0;

      for(const [i,w] of words.entries()) {
        const c = w[d];

        // Create new range list
        if(!this.index[wordLength][d][c]) this.index[wordLength][d][c] = []

        // Onto new char
        if(lastChar !== c && lastChar) {
          this.index[wordLength][d][lastChar].push([start, i-1]);
          start = i;
        }

        lastChar = c;
      }
    }
  }

  public getIndex() {
    return this.index;
  }
}

export default IndexBuilder;