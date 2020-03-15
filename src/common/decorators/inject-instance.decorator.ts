export function InjectInstance(clazz: any) {
  return (target: any, prop: string) => {
    if(clazz.prototype.constructor.getInstance && typeof clazz.prototype.constructor.getInstance === 'function')
    target[prop] = clazz.prototype.constructor.getInstance();
  }
}