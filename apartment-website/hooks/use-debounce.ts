export function useDebounce() {
  function debounce(func: Function, timeout = 300) {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(null, args);
      }, timeout);
    };
  }
  return debounce;
}
