import {
  QueuingStrategy,
  ReadableStream,
  ReadableStreamSource,
  WritableStream,
  WritableStreamSink
} from 'whatwg-streams';

export interface ReadableStreamConstructor {
  readonly prototype: ReadableStream;

  new<R = any>(underlyingSource?: ReadableStreamSource<R>,
               strategy?: QueuingStrategy<R>): ReadableStream<R>;
}

export interface WritableStreamConstructor {
  readonly prototype: WritableStream;

  new<W = any>(underlyingSink?: WritableStreamSink<W>,
               strategy?: QueuingStrategy<W>): WritableStream<W>;
}
