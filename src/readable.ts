import {
  ReadableStream,
  ReadableStreamDefaultController,
  ReadableStreamDefaultUnderlyingSource
} from './streams/readable-stream';
import { NativeReadableStream } from './streams/native';
import { ReceiverMessage, ReceiverType, SenderMessage, SenderType } from './protocol';

export function fromReadablePort<R = any>(port: MessagePort): ReadableStream<R> {
  return new NativeReadableStream<R>(new MessagePortSource(port));
}

export class MessagePortSource<R> implements ReadableStreamDefaultUnderlyingSource<R> {

  private _controller!: ReadableStreamDefaultController<R>;

  constructor(private _port: MessagePort) {
    this._port.onmessage = (event) => this._onMessage(event.data);
  }

  start(controller: ReadableStreamDefaultController<R>) {
    this._controller = controller;
  }

  pull(controller: ReadableStreamDefaultController<R>) {
    this._updateBackpressure();
  }

  cancel(reason: any) {
    const message: ReceiverMessage = {
      type: ReceiverType.ERROR,
      reason
    };
    this._port.postMessage(message);
    this._port.close();
  }

  private _onMessage(message: SenderMessage) {
    switch (message.type) {
      case SenderType.WRITE:
        // enqueue() will call pull() if needed when there's no backpressure
        this._controller.enqueue(message.chunk);
        break;
      case SenderType.ABORT:
        this._controller.error(message.reason);
        this._port.close();
        break;
      case SenderType.CLOSE:
        this._controller.close();
        this._port.close();
        break;
    }
  }

  private _updateBackpressure() {
    const message: ReceiverMessage = {
      type: ReceiverType.PULL
    };
    this._port.postMessage(message);
  }

}
