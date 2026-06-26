const KEY = 'jogga_recently_viewed';
const MAX = 25;

export type RecentlyViewedItem = {
  slug: string;
  name: string;
  imageUrl: string | null;
  price: number;
  comparePrice: number | null;
};

export function addToRecentlyViewed(item: RecentlyViewedItem): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRecentlyViewed();
    const deduped = existing.filter((i) => i.slug !== item.slug);
    const updated = [item, ...deduped].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
