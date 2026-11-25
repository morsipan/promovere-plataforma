/**
 * Ordena ítems de Prensa colocando primero los que tienen fecha de publicación
 * (del más reciente al más antiguo) y al final los que no tienen fecha explícita.
 */
export function sortPressItemsNewestFirst<
  T extends { publishedDate?: string | null; createdAt?: string | null }
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const timeA = a.publishedDate ? Date.parse(a.publishedDate) : Number.NaN;
    const timeB = b.publishedDate ? Date.parse(b.publishedDate) : Number.NaN;
    const validA = !Number.isNaN(timeA);
    const validB = !Number.isNaN(timeB);

    if (validA && validB) {
      if (timeB !== timeA) return timeB - timeA;
    } else if (validA) {
      return -1;
    } else if (validB) {
      return 1;
    }

    const createdA = a.createdAt ? Date.parse(a.createdAt) : 0;
    const createdB = b.createdAt ? Date.parse(b.createdAt) : 0;
    return createdB - createdA;
  });
}
