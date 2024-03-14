export * from './user';
export * from './news';
export * from './organization';
export * from './project';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
