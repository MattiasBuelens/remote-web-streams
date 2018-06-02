import { ReadableStream as ReadableStreamType, ReadableStreamConstructor } from './readable-stream';
import { WritableStream as WritableStreamType, WritableStreamConstructor } from './writable-stream';

export type NativeReadableStream = ReadableStreamType;
export const NativeReadableStream: ReadableStreamConstructor = ReadableStream as any;

export type NativeWritableStream = WritableStreamType;
export const NativeWritableStream: WritableStreamConstructor = WritableStream as any;
