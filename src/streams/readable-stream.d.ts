import { QueuingStrategy, ReadableStream, ReadableStreamSource } from 'whatwg-streams';

export interface ReadableStreamConstructor {
  readonly prototype: ReadableStream;

  new<R = any>(underlyingSource?: ReadableStreamSource<R>,
               strategy?: QueuingStrategy<R>): ReadableStream<R>;
}
