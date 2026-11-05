// Narrow, reviewed terminology corrections; never translate arbitrary prose here.
export const ENGLISH_TERM_CORRECTIONS = new Map([
  ['Self Palace', 'Life Palace'],
  ['pride of face', 'concern about appearances'],
  ['proud of face', 'overly concerned about appearances'],
  ['Put down face and overcaution', 'Set aside concerns about appearances and excessive caution'],
]);
export function normalizeEnglishZiweiTerms(text) {
  let result = String(text);
  for (const [from, to] of ENGLISH_TERM_CORRECTIONS) result = result.replaceAll(from, to);
  return result;
}
