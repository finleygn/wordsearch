export const validateWord = (text?: string): void => {
  // Has content
  if(!text) {
    throw new Error("No word provided");
  }
  // Alpha only
  if(!text.match(/^[a-zA-Z]+$/g)) {
    throw new Error("Invalid word");
  }
}

export const validateInput = (text?: string): void => {
  // Has content
  if(!text) {
    throw new Error("No word provided");
  }
  // Alpha only
  if(!text.match(/^[a-zA-Z\*]+$/g)) {
    throw new Error("Invalid word");
  }
}
