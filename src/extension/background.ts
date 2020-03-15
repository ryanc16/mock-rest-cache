import { IpcMessaging } from "../common/services/ipc-messaging";
import { IpcEvent } from "../common/models/ipc-events.enum";
import { RestCacheStore } from "../common/models/rest-cache-store.model";
import { RestCacheStoreEntry } from "../common/models/rest-cache-store-entry.model";
import { StorageService } from '../common/services/storage.service';

class Background {

  private _messaging: IpcMessaging = IpcMessaging.getInstance();
  private _restCaches: RestCacheStorage = {};
  constructor() {
    this.setupRequestListener();
    this._messaging.on(IpcEvent.REGISTER_TAB, (origin: string) => {
      if(origin in this._restCaches == false) {
        this._restCaches[origin] = new RestCacheStore(origin);
      }
    });
    this._messaging.on(IpcEvent.REQUEST_CACHED_URLS, async (origin: string) => {
       let cache = await StorageService.getInstance().getValue(origin);
      if(cache == null) {
        cache = this._restCaches[origin];
      }
      // this._messaging.emitToPopup({event: IpcEvent.RESPONSE_CACHED_URLS, payload: this._restCaches[origin]});
      this._messaging.emitToPopup({event: IpcEvent.RESPONSE_CACHED_URLS, payload: cache});
    });
    this._messaging.on(IpcEvent.ADD_ENTRY, (payload: {origin: string, entry: RestCacheStoreEntry}) => {
      this._restCaches[payload.origin].addEntry(payload.entry);
      StorageService.getInstance().saveValue(payload.origin, this._restCaches[payload.origin]);
    });
  }

  setupRequestListener() {
    if(chrome.webRequest.onBeforeRequest.hasListener(this.beforeRequestListener)) {
      chrome.webRequest.onBeforeRequest.removeListener(this.beforeRequestListener);
    }
    chrome.webRequest.onBeforeRequest.addListener(this.beforeRequestListener.bind(this), {urls: []}, ["blocking", "requestBody"]);
  }

  beforeRequestListener(requestDetails: chrome.webRequest.WebRequestDetails) {
    if(requestDetails.initiator in this._restCaches) {
      console.log(requestDetails);
    }
  }

  urlsChanged() {
    this.setupRequestListener();
  }
}

new Background();

type RestCacheStorage = {[origin: string]: RestCacheStore};