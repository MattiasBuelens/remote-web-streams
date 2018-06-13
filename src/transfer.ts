// https://developer.mozilla.org/en-US/docs/Web/API/Transferable
export type Transferable = ArrayBuffer | MessagePort | ImageBitmap;

/**
 * Returns which parts of a chunk should be transferred to the remote end.
 *
 * @param chunk The chunk to be sent
 * @return An array of {@link Transferable transferable} chunk parts
 */
export type TransferChunkCallback<T> = (chunk: T) => Transferable[];
