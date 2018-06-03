import {
  WritableStream,
  WritableStreamDefaultController,
  WritableStreamUnderlyingSink
} from './streams/writable-stream';
import { NativeWritableStream } from './streams/native';
import { ReceiverMessage, ReceiverType, SenderMessage, SenderType } from './protocol';

export function fromWritablePort<W = any>(port: MessagePort): WritableStream<W> {
  return new NativeWritableStream<W>(new MessagePortSink(port));
}

export class MessagePortSink<W> implements WritableStreamUnderlyingSink<W> {

  private _controller!: WritableStreamDefaultController;

  private _readyPromise!: Promise<void>;
  private _readyResolve!: () => void;
  private _readyReject!: (reason: any) => void;
  private _readyPending!: boolean;

  constructor(private _port: MessagePort) {
    this._resetReady();
    this._port.onmessage = (event) => this._onMessage(event.data);
  }

  start(controller: WritableStreamDefaultController) {
    this._controller = controller;

    // Apply initial backpressure
    return this._readyPromise;
  }

  write(chunk: W, controller: WritableStreamDefaultController) {
    const message: SenderMessage = {
      type: SenderType.WRITE,
      chunk
    };
    // TODO Transfer chunk?
    this._port.postMessage(message);
    // Assume backpressure after every write, until sender pulls
    this._resetReady();
    // Apply backpressure
    return this._readyPromise;
  }

  close() {
    const message: SenderMessage = {
      type: SenderType.CLOSE
    };
    this._port.postMessage(message);
    this._port.close();
  }

  abort(reason: any) {
    const message: SenderMessage = {
      type: SenderType.ABORT,
      reason
    };
    this._port.postMessage(message);
    this._port.close();
  }

  private _onMessage(message: ReceiverMessage) {
    switch (message.type) {
      case ReceiverType.PULL:
        this._resolveReady();
        break;
      case ReceiverType.ERROR:
        this._onError(message.reason);
        break;
    }
  }

  private _onError(reason: any) {
    this._controller.error(reason);
    this._rejectReady(reason);
    this._port.close();
  }

  private _resetReady() {
    this._readyPromise = new Promise<void>((resolve, reject) => {
      this._readyResolve = resolve;
      this._readyReject = reject;
    });
    this._readyPending = true;
  }

  private _resolveReady() {
    this._readyResolve();
    this._readyPending = false;
  }

  private _rejectReady(reason: any) {
    if (!this._readyPending) {
      this._resetReady();
    }
    this._readyPromise.catch(() => {});
    this._readyReject(reason);
    this._readyPending = false;
  }

}
