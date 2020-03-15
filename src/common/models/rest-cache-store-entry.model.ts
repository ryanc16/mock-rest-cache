export interface RestCacheStoreEntry {
  request: {
    path: string;
    method: string;
  };
  response: {
    body: string;
    status: number;
  };
}