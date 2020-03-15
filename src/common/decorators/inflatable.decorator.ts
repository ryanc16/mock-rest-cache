import { Type } from "../models/type.model";
import { MetadataService } from "./metadata.service";

export function Inflate(type: Type<any>) {
  return (target, propertyName, paramIndex) => {
    const transform = (flattened) => { return Object.assign(new type(), flattened)};
    MetadataService.getInstance().setMetadata(target, propertyName, transform, paramIndex);
  }
}
export function Inflatable(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  const method = descriptor.value;
  descriptor.value = function() {
    for(let i=0; i<arguments.length; i++) {
      const value = MetadataService.getInstance().getMetadata(target, propertyName, i);
      if(value != null) {
        if(typeof value === 'function') {
          arguments[i] = value(arguments[i]);
        }
        else {
          arguments[i] = value;
        }
      }
    }
    return method.apply(this, arguments);
  }
}