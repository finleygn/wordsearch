# Wordsearch

A word finding tool for listing all possible words given known and wildcard letters. For example searching `he*p` will return `[heap,help,hemp]`.

Not sure whats it's purpose is but can be helpful for wordle or crosswords. The indexing/search algorithm is made up by myself, I am certain something similar exists already and I have reinvented the wheel, but I'm not sure what it's called. 

## Benchmarks

Can look through ~200k words and find matches with 10 wildcard characters within 0.14ms. (See `/database/benchmark`, still need to verify this works as intended)

---

![First example](./doc/example.png)
![Second example](./doc/example2.png)

## Indexing/Search algorithm

TODO: Clarify this braindump

### Indexing

The index is created through mapping every alpha character, at each position in a word to a possible range.

For example, for 3 letter words, there will be a mapping for a-z at each postion 0,1,2 that point to ranges in the wordlist.

### Searching

#### No wildcards

Searching for the word "and" gives us the following index entries (on `.wordlist200k`)
```
a: [[0,87]]
n: [[45,52],257,[320,322],445,[555,559],761,[823,824],[878,880],[1108,1109],1198,[1249,1253],1330]
d: [12,23,46,57,90,103,...too many]
```

these are a list of indexes (ranges and single indexes) for possible words that character could be part of.
taking a union of all of these characters gives us

`0,87` -> `45,52` -> `46`

and the 46th letter in the wordlist is `and`.

#### With wildcards

Adding wildcards is simple, just don't reduce the word range for the character position that is wildcarded,

`a*d` would produce the ranges

`0,87` -> `*` -> `12,23,46,57`

which map to `[add,aid,and,ard]`

## Components

### Database

Contains a CLI for building indexes

#### TODO:

- Reduce block and index size (not every index needs to be a `Range` array).
- Fix when all characters are wildcards throwing error.

### Service

Backend service for making requests

## Notes

Don't judge code I wrote this as quick as possible
