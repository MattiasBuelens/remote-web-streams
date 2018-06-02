import { WritableStream } from './writable-stream';
import { QueuingStrategy } from './queuing-strategy';

export interface ReadableStreamConstructor {
  readonly prototype: ReadableStream;

  new<R = any>(underlyingSource?: ReadableStreamDefaultUnderlyingSource<R>,
               strategy?: Partial<QueuingStrategy>): ReadableStream<R>;
}

export interface ReadableStream<R = any> {
  readonly locked: boolean;

  getReader(): ReadableStreamDefaultReader<R>;
}

export interface ReadableWritableStreamPair<R = any, W = any> {
  readonly readable: ReadableStream<R>;
  readonly writable: WritableStream<W>;
}

export interface ReadableStreamDefaultUnderlyingSource<R = any> {
  start?(controller: ReadableStreamDefaultController<R>): void | Promise<void>;

  pull?(controller: ReadableStreamDefaultController<R>): void | Promise<void>;

  cancel?(reason: any): void | Promise<void>;
}

export interface ReadableStreamDefaultController<R = any> {
  readonly desiredSize: number | null;

  close(): void;

  enqueue(chunk: R): void;

  error(e: any): void;
}

export interface ReadableStreamDefaultReader<R = any> {
  readonly closed: Promise<void>;

  cancel(reason: any): Promise<void>;

  read(): Promise<IteratorResult<R>>;

  releaseLock(): void;
}
