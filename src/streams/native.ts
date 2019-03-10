import { ReadableStreamConstructor, WritableStreamConstructor } from './constructor';

export type NativeReadableStream<R = any> = ReadableStream<R>;
export const NativeReadableStream: ReadableStreamConstructor = typeof ReadableStream === 'function' ? ReadableStream as any : undefined;

export type NativeWritableStream<W = any> = WritableStream<W>;
export const NativeWritableStream: WritableStreamConstructor = typeof WritableStream === 'function' ? WritableStream as any : undefined;
