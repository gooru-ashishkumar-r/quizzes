/**
 * This function encodes special characters.
 */
export function encodeTerm(term) {
  return encodeURIComponent(term).replace(/[!'()*]/g, function(c) {
    return `%${c.charCodeAt(0).toString(16)}`;
  });
}
