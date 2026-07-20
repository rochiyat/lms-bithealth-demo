import type { AppDatabase, CollectionItem, CollectionName } from '@/domain/types';

export interface AppRepository {
  getDatabase(): Promise<AppDatabase>;
  replaceDatabase(database: AppDatabase): Promise<AppDatabase>;
  resetDatabase(): Promise<AppDatabase>;
  list<K extends CollectionName>(collection: K): Promise<AppDatabase[K]>;
  create<K extends CollectionName>(collection: K, item: CollectionItem<K>): Promise<CollectionItem<K>>;
  update<K extends CollectionName>(collection: K, id: string, patch: Partial<CollectionItem<K>>): Promise<CollectionItem<K>>;
  remove<K extends CollectionName>(collection: K, id: string): Promise<void>;
}
