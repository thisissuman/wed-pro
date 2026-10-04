/** One demo calendar. Call with a server/request or creation reference and
 * serialize the result; never compute a fresh clock inside a client render.
 */
export function getDemoDates(referenceIso: string) {
  const reference = new Date(referenceIso);
  const wedding = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), reference.getUTCDate() + 90));
  const dateAtOffset = (offset: number) => {
    const date = new Date(wedding);
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  };
  const weddingDate = dateAtOffset(0);
  return {
    weddingDate,
    eventDates: [-3, -2, -1, 0, 1].map(dateAtOffset),
    targetDate: weddingDate + "T19:30:00+05:30",
    displayDate: new Intl.DateTimeFormat("en-IN", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    }).format(wedding),
  };
}
