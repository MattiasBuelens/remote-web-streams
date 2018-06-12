import { ReadableStream as ReadableStreamType, ReadableStreamConstructor } from './readable-stream';
import { WritableStream as WritableStreamType, WritableStreamConstructor } from './writable-stream';

export type NativeReadableStream = ReadableStreamType;
export const NativeReadableStream: ReadableStreamConstructor = typeof ReadableStream === 'function' ? ReadableStream as any : undefined;

export type NativeWritableStream = WritableStreamType;
export const NativeWritableStream: WritableStreamConstructor = typeof WritableStream === 'function' ? WritableStream as any : undefined;
