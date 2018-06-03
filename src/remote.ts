import { ReadableStream } from './streams/readable-stream';
import { WritableStream } from './streams/writable-stream';
import { fromReadablePort } from './readable';
import { fromWritablePort } from './writable';

export class RemoteReadableStream<T = any> {

  readonly writablePort: MessagePort;
  readonly readable: ReadableStream<T>;

  constructor() {
    const channel = new MessageChannel();
    this.writablePort = channel.port1;
    this.readable = fromReadablePort<T>(channel.port2);
  }

}

export class RemoteWritableStream<T = any> {

  readonly readablePort: MessagePort;
  readonly writable: WritableStream<T>;

  constructor() {
    const channel = new MessageChannel();
    this.readablePort = channel.port1;
    this.writable = fromWritablePort<T>(channel.port2);
  }

}
