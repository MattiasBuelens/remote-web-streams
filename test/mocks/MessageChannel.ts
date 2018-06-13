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

export class MockMessagePort extends EventTarget implements MessagePort {
  private _onmessage: MessageEventHandler | null = null;
  private _other: MockMessagePort | undefined = undefined;
  private _queue: MessageEvent[] = [];
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
    for (let event of queue) {
      this._dispatchMessageEventAsync(event);
    }
  }

  postMessage(message?: any, transfer?: any[]): void {
    const event = new MessageEvent('message', { data: message });
    this._other!._postMessage(event);
  }

  close(): void {
    this._other = undefined;
    this._queue.length = 0;
  }

  get onmessage(): MessageEventHandler | null {
    return this._onmessage;
  }

  set onmessage(handler: MessageEventHandler | null) {
    this._onmessage = handler;
    // The first time a MessagePort object's onmessage IDL attribute is set,
    // the port's port message queue must be enabled, as if the start() method had been called.
    // https://html.spec.whatwg.org/multipage/web-messaging.html#message-ports:handler-messageport-onmessage-2
    this.start();
  }

  private _postMessage(event: MessageEvent) {
    if (this._started) {
      this._dispatchMessageEventAsync(event);
    } else {
      this._queue.push(event);
    }
  }

  private _dispatchMessageEventAsync(event: MessageEvent) {
    setTimeout(this._dispatchMessageEventSync, 0, event);
  }

  private _dispatchMessageEventSync = (event: MessageEvent) => {
    this.dispatchEvent(event);
    if (typeof this._onmessage === 'function') {
      this._onmessage(event);
    }
  };

}
