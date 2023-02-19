export function validateInput(text?: string) {
  // Has content
  if(!text) {
    throw new Error("No word provided");
  }
  // Alpha only
  if(!text.match(/^[a-zA-Z\*]+$/g)) {
    throw new Error("Invalid word");
  }
}