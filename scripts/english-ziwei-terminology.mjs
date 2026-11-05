// Narrow, reviewed terminology corrections; never translate arbitrary prose here.
export const ENGLISH_TERM_CORRECTIONS = new Map([
  ['Self Palace', 'Life Palace'],
  ['pride of face', 'concern about appearances'],
]);
export function normalizeEnglishZiweiTerms(text) {
  let result = String(text);
  for (const [from, to] of ENGLISH_TERM_CORRECTIONS) result = result.replaceAll(from, to);
  return result;
}
