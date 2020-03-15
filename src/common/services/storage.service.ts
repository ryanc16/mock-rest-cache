export class StorageService {

  private static _instance: StorageService;
  private constructor() {

  }

  static getInstance(): StorageService {
    if(this._instance == null) {
      this._instance = new StorageService();
    }
    return this._instance;
  }
  
  getStorageUsage(): Promise<StorageUsageModel> {
    return new Promise(resolve => {
      chrome.storage.local.getBytesInUse(used => {
        const usage: StorageUsageModel = {
          total: chrome.storage.local.QUOTA_BYTES,
          used: used
        };
        resolve(usage);
      });
    })
  }

  saveValue(key: string, value: any): Promise<void> {
    return new Promise(resolve => {
      const save = {};
      save[key] = value;
      chrome.storage.local.set(save, () => {
        resolve();
      });
    });
  }

  save(obj: object): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.set(obj, () => {
        resolve();
      });
    });
  }

  get(): Promise<object> {
    return new Promise(resolve => {
      chrome.storage.local.get(obj => {
        resolve(obj);
      });
    });
  }

  getValue(key: string): Promise<any> {
    return new Promise(resolve => {
      chrome.storage.local.get(obj => {
        resolve(obj[key]);
      });
    });
  }

  delete(keys: string|string[]): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.remove(keys, () => {
        resolve();
      });
    });
  }

  clear(): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.clear(() => {
        resolve();
      });
    });
  }

}

interface StorageUsageModel {
  total: number;
  used: number;
}