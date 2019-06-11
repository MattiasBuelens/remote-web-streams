import { MockEventTarget } from './EventTarget';

export class MockMessageChannel implements MessageChannel {
  readonly port1: MessagePort;
  readonly port2: MessagePort;

  constructor() {
    const port1 = new MockMessagePort();
    const port2 = new MockMessagePort();
    port1._entangle(port2);
    port2._entangle(port1);
    this.port1 = port1;
    this.port2 = port2;
  }
}

export type MessageEventHandler = (this: MessagePort, ev: MessageEvent) => any;

export class MockMessagePort extends MockEventTarget implements MessagePort {
  private _messageHandler: MessageEventHandler | null = null;
  private _messageHandlerListening: boolean = false;

  private _other: MockMessagePort | undefined = undefined;
  private _queue: any[] = [];
  private _started: boolean = false;

  _entangle(other: MockMessagePort) {
    this._other = other;
  }

  start(): void {
    if (this._started) {
      return;
    }
    this._started = true;
    const queue = this._queue.slice();
    this._queue.length = 0;
    for (let message of queue) {
      this._dispatchMessageEventAsync(message);
    }
  }

  postMessage(message: any): void {
    this._other!._receiveMessage(message);
  }

  close(): void {
    this._other = undefined;
    this._queue.length = 0;
  }

  get onmessage(): MessageEventHandler | null {
    return this._messageHandler;
  }

  set onmessage(handler: MessageEventHandler | null) {
    this._messageHandler = handler;
    if (!this._messageHandlerListening) {
      this.addEventListener('message', this._messageListener);
      this._messageHandlerListening = true;
    }
    // The first time a MessagePort object's onmessage IDL attribute is set,
    // the port's port message queue must be enabled, as if the start() method had been called.
    // https://html.spec.whatwg.org/multipage/web-messaging.html#message-ports:handler-messageport-onmessage-2
    this.start();
  }

  private _messageListener = (event: MessageEvent) => {
    if (this._messageHandler) {
      this._messageHandler(event);
    }
  };

  private _receiveMessage(message: any) {
    if (this._started) {
      this._dispatchMessageEventAsync(message);
    } else {
      this._queue.push(message);
    }
  }

  private _dispatchMessageEventAsync(message: any) {
    setTimeout(this._dispatchMessageEventSync, 0, message);
  }

  private _dispatchMessageEventSync = (message: any) => {
    const event = new MessageEvent('message', { data: message });
    this.dispatchEvent(event);
  };

}

// Copied from lib.dom.d.ts
export interface MockMessagePort extends MessagePort {

  addEventListener<K extends keyof MessagePortEventMap>(type: K, listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof MessagePortEventMap>(type: K, listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any, options?: boolean | EventListenerOptions): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

}
