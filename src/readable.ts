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
    this._updateBackpressure(this._controller.desiredSize);
  }

  cancel(reason: any) {
    const message: ReceiverMessage = {
      type: ReceiverType.ERROR,
      reason
    };
    this._port.postMessage(message);
  }

  private _onMessage(message: SenderMessage) {
    switch (message.type) {
      case SenderType.WRITE:
        this._controller.enqueue(message.chunk);
        this._updateBackpressure(this._controller.desiredSize);
        break;
      case SenderType.ABORT:
        this._controller.error(message.reason);
        break;
      case SenderType.CLOSE:
        this._controller.close();
        break;
    }
  }

  private _updateBackpressure(desiredSize: number | null) {
    if (desiredSize === null) {
      // TODO Okay to ignore errors here?
      return;
    }
    const backpressure = desiredSize <= 0;
    const message: ReceiverMessage = {
      type: ReceiverType.BACKPRESSURE,
      backpressure
    };
    this._port.postMessage(message);
  }

}
