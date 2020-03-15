import { Type } from '../models/type.model';

export class MetadataService {

  private _metadata: {
    [targetName: string]: {
      target: Type<any>;
      props: {
        [prop: string]: any[]
      }
    }
  };

  private static _instance: MetadataService;

  private constructor() {
    this._metadata = {};
    // window = Object.defineProperty(window, 'metadata', {value: {}});
  }

  static getInstance(): MetadataService {
    if(this._instance == null) {
      this._instance = new MetadataService();
    }
    return this._instance;
  }

  setMetadata(target: Type<any>, prop: string, value: any, argIndex?: number) {
    if(target.constructor.name in this._metadata == false) {
      this._metadata[target.constructor.name] = {target: target, props: {}};
    }
    if(prop in this._metadata[target.constructor.name].props == false) {
      this._metadata[target.constructor.name].props[prop] = [];
    }
    if(argIndex != null) {
      this._metadata[target.constructor.name].props[prop][argIndex] = value;
    }
    else {
      this._metadata[target.constructor.name].props[prop].push(value);
    }
  }

  getMetadata(target: Type<any>, prop: string, argIndex?: number): any {
    const values = this._metadata[target.constructor.name].props[prop];
    if(argIndex != null) {
      return values[argIndex];
    }
    else {
      return values[0];
    }
  }
}
