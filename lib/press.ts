/**
 * Ordena ítems de Prensa y Contenidos del más reciente al más antiguo
 * respetando el orden cronológico normalizado en createdAt (y nuevas altas en /admin primero).
 */
export function sortPressItemsNewestFirst<
  T extends { publishedDate?: string | null; createdAt?: string | null }
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const createdA = a.createdAt ? Date.parse(a.createdAt) : 0;
    const createdB = b.createdAt ? Date.parse(b.createdAt) : 0;
    if (createdB !== createdA) return createdB - createdA;

    const timeA = a.publishedDate ? Date.parse(a.publishedDate) : 0;
    const timeB = b.publishedDate ? Date.parse(b.publishedDate) : 0;
    return timeB - timeA;
  });
}
