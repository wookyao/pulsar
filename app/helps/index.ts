const largeArray = new Array(100000).fill(0).map((_, index) => index); // Example large array

function loadChunk<T>(array: T[], startIndex: number, chunkSize: number) {
  const endIndex = Math.min(startIndex + chunkSize, array.length);
  const slice = array.slice(startIndex, endIndex);
  return [endIndex, slice] as const;
}

function loadLargeArray<T>(array: T[], fn: (slice: T[]) => void, chunkSize: number = 80) {
  let currentIndex = 0;

  function loadNextChunk() {
    if (currentIndex < array.length) {
      const [index, slice]  = loadChunk(array, currentIndex, chunkSize);
      currentIndex = index;
      requestAnimationFrame(loadNextChunk);
      fn(slice)
    }
  }

   loadNextChunk();
}



export {
  loadLargeArray
}
