import { ReadableStream as ReadableStreamType, WritableStream as WritableStreamType } from 'whatwg-streams';
import { ReadableStreamConstructor, WritableStreamConstructor } from './constructor';

export type NativeReadableStream = ReadableStreamType;
export const NativeReadableStream: ReadableStreamConstructor = typeof ReadableStream === 'function' ? ReadableStream as any : undefined;

export type NativeWritableStream = WritableStreamType;
export const NativeWritableStream: WritableStreamConstructor = typeof WritableStream === 'function' ? WritableStream as any : undefined;
