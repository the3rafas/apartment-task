function readableText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function deriveMapFromArray<T>(
  array: T[],
  extractKeyFn: (item: T) => T[keyof T],
) {
  const map = new Map<T[keyof T], T>();
  array.forEach((item) => {
    map.set(extractKeyFn(item), item);
  });
  return map;
}

export { deriveMapFromArray, readableText };
