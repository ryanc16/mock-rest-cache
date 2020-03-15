export function byId(id) {
  return (target, prop) => {
    let original = null;
    if(target.onInit != null && typeof target.onInit === 'function') {
      original = target.onInit;
    }
    target.onInit = () => {
      target[prop] = document.querySelector('#'+id);
      if(original != null) {
        original.apply(target);
      }
    }
  }
}