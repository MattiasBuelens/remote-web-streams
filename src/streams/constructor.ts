export interface ReadableStreamConstructor {
  readonly prototype: ReadableStream;

  new<R = any>(underlyingSource?: UnderlyingSource<R>,
               strategy?: QueuingStrategy<R>): ReadableStream<R>;
}

export interface WritableStreamConstructor {
  readonly prototype: WritableStream;

  new<W = any>(underlyingSink?: UnderlyingSink<W>,
               strategy?: QueuingStrategy<W>): WritableStream<W>;
}
