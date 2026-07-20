import { createSeedDatabase } from '@/data/seed';
import type { AppDatabase, CollectionItem, CollectionName } from '@/domain/types';
import type { AppRepository } from './AppRepository';

const DATABASE_KEY = 'bithealth-learning-hub-db-v3';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export class LocalStorageRepository implements AppRepository {
  private read(): AppDatabase {
    const saved = localStorage.getItem(DATABASE_KEY);
    if (!saved) {
      const seed = createSeedDatabase();
      localStorage.setItem(DATABASE_KEY, JSON.stringify(seed));
      return seed;
    }

    try {
      return JSON.parse(saved) as AppDatabase;
    } catch {
      const seed = createSeedDatabase();
      localStorage.setItem(DATABASE_KEY, JSON.stringify(seed));
      return seed;
    }
  }

  private write(database: AppDatabase) {
    localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
  }

  async getDatabase() { return clone(this.read()); }

  async replaceDatabase(database: AppDatabase) {
    this.write(database);
    return clone(database);
  }

  async resetDatabase() {
    const seed = createSeedDatabase();
    this.write(seed);
    return clone(seed);
  }

  async list<K extends CollectionName>(collection: K) {
    return clone(this.read()[collection]);
  }

  async create<K extends CollectionName>(collection: K, item: CollectionItem<K>) {
    const database = this.read();
    (database[collection] as CollectionItem<K>[]).push(item);
    this.write(database);
    return clone(item);
  }

  async update<K extends CollectionName>(collection: K, id: string, patch: Partial<CollectionItem<K>>) {
    const database = this.read();
    const list = database[collection] as CollectionItem<K>[];
    const index = list.findIndex((item) => item.id === id);
    if (index < 0) throw new Error(`Data ${id} tidak ditemukan di ${collection}.`);
    const updated = { ...list[index], ...patch, updatedAt: new Date().toISOString() } as CollectionItem<K>;
    list[index] = updated;
    this.write(database);
    return clone(updated);
  }

  async remove<K extends CollectionName>(collection: K, id: string) {
    const database = this.read();
    const list = database[collection] as CollectionItem<K>[];
    database[collection] = list.filter((item) => item.id !== id) as AppDatabase[K];
    this.write(database);
  }
}
