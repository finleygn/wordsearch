export function validateInput(text?: string) {
  return text && text.match(/^[a-zA-Z\*]+$/g);
}