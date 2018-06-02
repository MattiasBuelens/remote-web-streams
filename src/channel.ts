import { ReadableStream, ReadableWritableStreamPair } from './streams/readable-stream';
import { WritableStream } from './streams/writable-stream';
import { fromReadablePort } from './readable';
import { fromWritablePort } from './writable';

export class MessageChannelStream<T> implements ReadableWritableStreamPair<T, T> {

  readonly readablePort: MessagePort;
  readonly writablePort: MessagePort;
  _readable: ReadableStream<T> | undefined = undefined;
  _writable: WritableStream<T> | undefined = undefined;

  constructor() {
    const channel = new MessageChannel();
    this.readablePort = channel.port1;
    this.writablePort = channel.port2;
  }

  get readable() {
    if (!this._readable) {
      this._readable = fromReadablePort<T>(this.readablePort);
    }
    return this._readable;
  }

  get writable() {
    if (!this._writable) {
      this._writable = fromWritablePort<T>(this.writablePort);
    }
    return this._writable;
  }

}
