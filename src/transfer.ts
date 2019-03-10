/**
 * Returns which parts of a chunk should be transferred to the remote end.
 *
 * @param chunk The chunk to be sent
 * @return An array of {@link Transferable transferable} chunk parts
 */
export type TransferChunkCallback<T> = (chunk: T) => Transferable[];
