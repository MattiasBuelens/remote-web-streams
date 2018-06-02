import { ReadableStream, ReadableWritableStreamPair } from './streams/readable-stream';
import { WritableStream } from './streams/writable-stream';
import { fromReadablePort } from './readable';
import { fromWritablePort } from './writable';

export class MessageChannelStream<T> implements ReadableWritableStreamPair<T, T> {

  readonly readablePort: MessagePort;
  readonly writablePort: MessagePort;
  readonly readable: ReadableStream<T>;
  readonly writable: WritableStream<T>;

  constructor() {
    const channel = new MessageChannel();
    this.readablePort = channel.port1;
    this.writablePort = channel.port2;
    this.readable = fromReadablePort<T>(this.readablePort);
    this.writable = fromWritablePort<T>(this.writablePort);
  }

}
