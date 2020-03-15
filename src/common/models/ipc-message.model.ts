import { IpcEvent } from "./ipc-events.enum";

export interface IpcMessageModel<T> {
  event: IpcEvent;
  payload?: T;
}