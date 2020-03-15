import { IpcMessaging } from "../common/services/ipc-messaging";
import { IpcEvent } from "../common/models/ipc-events.enum";

class Content {

  private _messaging: IpcMessaging = IpcMessaging.getInstance();
  private _origin: string = window.location.origin;

  constructor() {
    this._messaging.on(IpcEvent.REGISTER_TAB, () => {
      this._messaging.emitToBackground({event: IpcEvent.REGISTER_TAB, payload: this._origin});
    });
    this._messaging.on(IpcEvent.REQUEST_CACHED_URLS, () => {
      this._messaging.emitToBackground({event: IpcEvent.REQUEST_CACHED_URLS, payload: this._origin});
    });
  }
}

new Content();