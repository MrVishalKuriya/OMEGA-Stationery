const RECENT_SEARCHES_STORAGE_KEY = 'omega_catalog_recent_searches_v1';
const MAX_RECENT_SEARCHES = 5;
const RECENT_SEARCHES_EVENT = 'omega-recent-searches-updated';

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => item.trim())
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): string[] {
  if (typeof window === 'undefined') return [];
  const trimmed = query.trim();
  if (trimmed.length < 2) return getRecentSearches();

  try {
    const current = getRecentSearches();
    const deduplicated = current.filter(
      (existing) => existing.toLowerCase() !== trimmed.toLowerCase()
    );
    const updated = [trimmed, ...deduplicated].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(RECENT_SEARCHES_EVENT));
    return updated;
  } catch {
    return getRecentSearches();
  }
}

export function removeRecentSearch(queryToRemove: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getRecentSearches();
    const updated = current.filter(
      (item) => item.toLowerCase() !== queryToRemove.trim().toLowerCase()
    );
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(RECENT_SEARCHES_EVENT));
    return updated;
  } catch {
    return getRecentSearches();
  }
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(RECENT_SEARCHES_EVENT));
  } catch {
    // ignore storage errors
  }
}

export function subscribeRecentSearches(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(RECENT_SEARCHES_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(RECENT_SEARCHES_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
