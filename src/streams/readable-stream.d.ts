import {
  QueuingStrategy,
  ReadableStream,
  ReadableStreamDefaultController,
  ReadableStreamDefaultReader,
  ReadableStreamSource,
  WritableReadablePair
} from 'whatwg-streams';

export interface ReadableStreamConstructor {
  readonly prototype: ReadableStream;

  new<R = any>(underlyingSource?: ReadableStreamSource<R>,
               strategy?: QueuingStrategy<R>): ReadableStream<R>;
}

export {
  QueuingStrategy,
  ReadableStream,
  ReadableStreamDefaultController,
  ReadableStreamDefaultReader,
  ReadableStreamSource,
  WritableReadablePair
};
