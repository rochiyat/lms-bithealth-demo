import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppDatabase, CollectionItem, CollectionName } from '@/domain/types';
import { repository } from '@/infrastructure/repositories';
import { isoNow, uid } from '@/utils/format';

interface AppDataContextValue {
  db: AppDatabase | null;
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  createItem: <K extends CollectionName>(collection: K, item: Omit<CollectionItem<K>, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<CollectionItem<K>, 'id'>>) => Promise<void>;
  updateItem: <K extends CollectionName>(collection: K, id: string, patch: Partial<CollectionItem<K>>) => Promise<void>;
  deleteItem: <K extends CollectionName>(collection: K, id: string) => Promise<void>;
  reset: () => Promise<void>;
  replace: (database: AppDatabase) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<AppDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setDb(await repository.getDatabase());
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const createItem: AppDataContextValue['createItem'] = async (collection, item) => {
    const timestamp = isoNow();
    const entity = { ...item, id: item.id ?? uid(collection), createdAt: timestamp, updatedAt: timestamp } as CollectionItem<typeof collection>;
    await repository.create(collection, entity);
    await refresh();
  };

  const updateItem: AppDataContextValue['updateItem'] = async (collection, id, patch) => {
    await repository.update(collection, id, patch);
    await refresh();
  };

  const deleteItem: AppDataContextValue['deleteItem'] = async (collection, id) => {
    await repository.remove(collection, id);
    await refresh();
  };

  const reset = async () => { setDb(await repository.resetDatabase()); };
  const replace = async (database: AppDatabase) => { setDb(await repository.replaceDatabase(database)); };

  const value = useMemo(() => ({ db, loading, error, refresh, createItem, updateItem, deleteItem, reset, replace }), [db, loading, error, refresh]);
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export const useAppData = () => {
  const value = useContext(AppDataContext);
  if (!value) throw new Error('useAppData harus dipakai di dalam AppDataProvider.');
  return value;
};
