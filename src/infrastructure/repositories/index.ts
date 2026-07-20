import type { AppRepository } from './AppRepository';
import { HttpRepository } from './httpRepository';
import { LocalStorageRepository } from './localStorageRepository';

const dataSource = import.meta.env.VITE_DATA_SOURCE ?? 'local';
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export const repository: AppRepository = dataSource === 'api'
  ? new HttpRepository(baseUrl)
  : new LocalStorageRepository();

export type { AppRepository } from './AppRepository';
