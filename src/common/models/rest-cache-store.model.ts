import { RestCacheStoreEntry } from "./rest-cache-store-entry.model";

export class RestCacheStore {

  entries: RestCacheStoreEntry[] = [];
  constructor(public origin: string) {

  }

  addEntry(entry: RestCacheStoreEntry): void {
    this.entries.push(entry);
  }

  add(path: string, method: string, response: string, status: number) {
    const entry: RestCacheStoreEntry = {
      request: {
        path: path,
        method: method
      },
      response: {
        body: response,
        status: status
      }
    };
    this.addEntry(entry);
  }

  removeEntry(entry: RestCacheStoreEntry): void {
    this.remove(entry.request.path);
  }

  remove(path: string): void {
    const index = this.entries.findIndex(entry => entry.request.path === path);
    this.entries.splice(index, 1);
  }

}