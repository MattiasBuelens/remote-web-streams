import { ReadableStream } from './streams/readable-stream';
import { WritableStream } from './streams/writable-stream';
import { fromReadablePort } from './readable';
import { fromWritablePort } from './writable';

export class RemoteReadableStream<R = any> {

  readonly writablePort: MessagePort;
  readonly readable: ReadableStream<R>;

  constructor() {
    const channel = new MessageChannel();
    this.writablePort = channel.port1;
    this.readable = fromReadablePort<R>(channel.port2);
  }

}

export class RemoteWritableStream<W = any> {

  readonly readablePort: MessagePort;
  readonly writable: WritableStream<W>;

  constructor() {
    const channel = new MessageChannel();
    this.readablePort = channel.port1;
    this.writable = fromWritablePort<W>(channel.port2);
  }

}
