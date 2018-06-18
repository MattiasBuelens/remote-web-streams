import {
  QueuingStrategy,
  WritableStream,
  WritableStreamDefaultController,
  WritableStreamDefaultWriter,
  WritableStreamSink
} from 'whatwg-streams';

export interface WritableStreamConstructor {
  readonly prototype: WritableStream;

  new<W = any>(underlyingSink?: WritableStreamSink<W>,
               strategy?: QueuingStrategy<W>): WritableStream<W>;
}

export {
  QueuingStrategy,
  WritableStream,
  WritableStreamDefaultController,
  WritableStreamDefaultWriter,
  WritableStreamSink
};
