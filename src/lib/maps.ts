/**
 * Deep-link helpers for map apps.
 *
 * Indian guests often travel between multiple venues (Mehendi, Sangeet,
 * Wedding, Reception). Coordinates produce far more reliable navigation
 * than text addresses pasted into a generic map link.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapTarget {
  coordinates?: Coordinates;
  label?: string;
  /** Fallback link if no coordinates are provided */
  googleMapLink?: string;
}

export function googleMapsUrl(target: MapTarget): string | null {
  if (target.coordinates) {
    const { lat, lng } = target.coordinates;
    const query = target.label ? `${lat},${lng}(${encodeURIComponent(target.label)})` : `${lat},${lng}`;
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }
  return target.googleMapLink ?? null;
}

export function appleMapsUrl(target: MapTarget): string | null {
  if (!target.coordinates) return null;
  const { lat, lng } = target.coordinates;
  const params = new URLSearchParams({ ll: `${lat},${lng}` });
  if (target.label) {
    params.set("q", target.label);
  }
  return `https://maps.apple.com/?${params.toString()}`;
}

export function hasMapTarget(target: MapTarget): boolean {
  return Boolean(target.coordinates) || Boolean(target.googleMapLink);
}
