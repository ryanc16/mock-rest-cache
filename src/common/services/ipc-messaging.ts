import { IpcEvent } from "../models/ipc-events.enum";
import { IpcMessageModel } from "../models/ipc-message.model";

export class IpcMessaging {

  private _events: {[index: string]: Function[]} = {};
  
  private static _instance: IpcMessaging = null;
  private constructor() {
    this._registerIpcListener();
  }

  static getInstance(): IpcMessaging {
    if(this._instance == null) {
      this._instance = new IpcMessaging();
    }
    return this._instance;
  }

  private _registerIpcListener() {
    chrome.runtime.onMessage.addListener((msg: IpcMessageModel<any>, sender: chrome.runtime.MessageSender, passedCb: (response) => void) => {
      if(msg.event in this._events) {
        for(const handler of this._events[msg.event]) {
          handler(msg.payload);
          passedCb(msg.payload);
        }
      }
      else {
        passedCb(null);
      }
      return true;
    });
  }
  

  emitToBackground<T>(msg: IpcMessageModel<T>, cb?: (response) => void): void {
    if(cb == null) {
      cb = () => { return true };
    }
    chrome.runtime.sendMessage(msg, cb);
  }

  emitToPopup<T>(msg: IpcMessageModel<T>, cb?: (response) => void): void {
    if(cb == null) {
      cb = () => { return true };
    }
    chrome.runtime.sendMessage(msg, cb);
  }

  emitToContent<T>(msg: IpcMessageModel<T>, cb?: (response) => void): void {
    chrome.tabs.query({active: true}, (tabs) => {
      if(cb == null) {
        cb = () => { return true };
      }
      chrome.tabs.sendMessage(tabs[0].id, msg, cb);
    });
  }

  on(event: IpcEvent, cb: (payload?: any) => void): void {
    if(event in this._events == false) {
      this._events[event] = [];
    }
    this._events[event].push(cb);
  }
}