import type { AppDatabase, CollectionItem, CollectionName } from '@/domain/types';
import type { AppRepository } from './AppRepository';

/**
 * REST adapter template. The UI only depends on AppRepository, so switching from
 * localStorage to a backend only requires setting VITE_DATA_SOURCE=api and
 * matching these endpoint contracts in the backend/BFF.
 */
export class HttpRepository implements AppRepository {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      credentials: 'include',
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || `HTTP ${response.status}`);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  getDatabase() { return this.request<AppDatabase>('/demo/database'); }
  replaceDatabase(database: AppDatabase) { return this.request<AppDatabase>('/demo/database', { method: 'PUT', body: JSON.stringify(database) }); }
  resetDatabase() { return this.request<AppDatabase>('/demo/database/reset', { method: 'POST' }); }
  list<K extends CollectionName>(collection: K) { return this.request<AppDatabase[K]>(`/${collection}`); }
  create<K extends CollectionName>(collection: K, item: CollectionItem<K>) { return this.request<CollectionItem<K>>(`/${collection}`, { method: 'POST', body: JSON.stringify(item) }); }
  update<K extends CollectionName>(collection: K, id: string, patch: Partial<CollectionItem<K>>) { return this.request<CollectionItem<K>>(`/${collection}/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }); }
  remove<K extends CollectionName>(collection: K, id: string) { return this.request<void>(`/${collection}/${id}`, { method: 'DELETE' }); }
}
