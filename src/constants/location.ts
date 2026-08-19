export const LOCATION_RESTRICTION_MESSAGE =
  "Unfortunately, our service is not yet available in your location.";

/**
 * Validates whether a given US ZIP code belongs to Florida (32000-34999) or Georgia (30000-31999, 39901).
 * Accepts 5-digit ZIP or 9-digit ZIP+4 formats (e.g. "33101", "30301-1234").
 */
export function isFloridaOrGeorgiaZip(zip: string | null | undefined): boolean {
  if (!zip) return false;
  const cleaned = zip.replace(/\D/g, "");
  if (cleaned.length < 5) return false;

  const prefix5 = parseInt(cleaned.slice(0, 5), 10);
  if (isNaN(prefix5)) return false;

  // Florida ZIP Range: 32000 – 34999
  const isFlorida = prefix5 >= 32000 && prefix5 <= 34999;

  // Georgia ZIP Range: 30000 – 31999 or 39901
  const isGeorgia = (prefix5 >= 30000 && prefix5 <= 31999) || prefix5 === 39901;

  return isFlorida || isGeorgia;
}

/**
 * Checks address string or state tokens for FL/Georgia presence if zip is ambiguous.
 */
export function isFloridaOrGeorgiaLocation(zip?: string, address?: string): boolean {
  if (zip && isFloridaOrGeorgiaZip(zip)) return true;

  if (address) {
    const upper = address.toUpperCase();
    const stateMatches = /\b(FL|GA|FLORIDA|GEORGIA)\b/.test(upper);
    if (stateMatches) return true;

    // Check if a valid 5-digit ZIP is in the address string
    const zipMatches = address.match(/\b\d{5}(?:-\d{4})?\b/g);
    if (zipMatches) {
      for (const z of zipMatches) {
        if (isFloridaOrGeorgiaZip(z)) return true;
      }
    }
  }

  return false;
}
