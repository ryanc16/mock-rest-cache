export function Lifecycle(constructor: Function) {
  if(constructor.prototype.onInit != null && typeof constructor.prototype.onInit === 'function') {
    document.onreadystatechange = (ev) => {
      constructor.prototype.onInit.apply(this);
      document.onreadystatechange = null;
    }
  }
}