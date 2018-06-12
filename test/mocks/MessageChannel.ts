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

export class MockMessagePort extends EventTarget implements MessagePort {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  private _other: MockMessagePort | undefined = undefined;

  _entangle(other: MockMessagePort) {
    this._other = other;
  }

  start(): void {
  }

  postMessage(message?: any, transfer?: any[]): void {
    const event = new MessageEvent('message', { data: message });
    this._other!.dispatchEvent(event); // TODO async
  }

  close(): void {
    this._other = undefined;
  }

}
