
export interface IUseProfile {
  userId: number;
  profileId: number;
}

export interface SearchParams {
  column: string;
  value: any;
}

export type Filter<T> = T

export interface Update<T, D> {
  filter: Filter<T>;
  data: D
}
