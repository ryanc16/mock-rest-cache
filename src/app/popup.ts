import { IpcMessaging } from "../common/services/ipc-messaging";
import { IpcEvent } from "../common/models/ipc-events.enum";
import { RestCacheStoreEntry } from '../common/models/rest-cache-store-entry.model';
import { RestCacheStore } from '../common/models/rest-cache-store.model';
import { byId } from "./decorators/by-id.decorator";
import { Inflate, Inflatable } from "../common/decorators/inflatable.decorator";
import { Lifecycle } from "./decorators/lifecycle.decorator";
import { onInit } from "./models/on-init.model";
import { StorageService } from "../common/services/storage.service";
import { InjectInstance } from "../common/decorators/inject-instance.decorator";
import './styles.css';

@Lifecycle
class Popup implements onInit {

  @InjectInstance(IpcMessaging)
  private _messaging: IpcMessaging;
  @InjectInstance(StorageService)
  private _storage: StorageService;
  
  private _cache: RestCacheStore;

  @byId('txtPath')
  private txtPath: HTMLInputElement;
  @byId('optMethod')
  private optMethod: HTMLSelectElement;
  @byId('txtResponse')
  private txtResponse: HTMLTextAreaElement;
  @byId('numStatus')
  private numStatus: HTMLInputElement;
  @byId('btnAdd')
  private btnAdd: HTMLButtonElement;
  @byId('lstStoredRequests')
  private lstStoredRequests: HTMLUListElement;

  constructor() {
    
  }

  onInit(): void {
    this.initForm();
    this._messaging.emitToContent({event: IpcEvent.REGISTER_TAB, payload: null});
    this._messaging.emitToContent({event: IpcEvent.REQUEST_CACHED_URLS, payload: null});
    this._messaging.on(IpcEvent.RESPONSE_CACHED_URLS, this.handleResponseCachedUrls.bind(this));
    this.btnAdd.addEventListener('click', () => this.addToUrls());
    this._storage.getStorageUsage().then(
      usage => {
        console.log(usage, usage.used/usage.total);
      }
    );
  }

  initForm() {
    this.txtPath.value = '';
    this.optMethod.value = 'GET';
    this.txtResponse.value = '';
    this.numStatus.value = '200';
  }

  @Inflatable
  handleResponseCachedUrls(@Inflate(RestCacheStore) cache: RestCacheStore) {
    this._cache = cache;
    console.log(this._cache);
    for(let entry of this._cache.entries) {
      const li = document.createElement('li');
      li.textContent = entry.request.method + ' ' + entry.request.path;
      li.className = 'list-group-item';
      this.lstStoredRequests.appendChild(li);
    }
  }

  addToUrls() {
    const entry: RestCacheStoreEntry = {
      request: {
        path: this.txtPath.value,
        method: this.optMethod.value
      },
      response: {
        body: this.txtResponse.value,
        status: parseInt(this.numStatus.value)
      }
    };
    this.txtPath.value = '';
    this.optMethod.value = 'GET';
    this.txtResponse.value = '';
    this.numStatus.value = '';
    this._cache.addEntry(entry);
    this._messaging.emitToBackground({event: IpcEvent.ADD_ENTRY, payload: {origin: this._cache.origin, entry: entry}});
  }

}
new Popup();