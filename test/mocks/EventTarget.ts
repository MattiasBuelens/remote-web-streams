export class MockEventTarget implements EventTarget {

  private readonly _delegateEventTarget: EventTarget;

  constructor() {
    // Cannot create or extend EventTarget in jsdom, since it's not attached to a document
    // Instead, delegate to another light-weight EventTarget instance
    // See https://github.com/jsdom/jsdom/issues/2173
    this._delegateEventTarget = new AbortController().signal;
  }

  addEventListener(type: string,
                   listener: EventListenerOrEventListenerObject | null,
                   options?: boolean | AddEventListenerOptions): void {
    this._delegateEventTarget.addEventListener(type, listener, options);
  }

  dispatchEvent(evt: Event): boolean {
    return this._delegateEventTarget.dispatchEvent(evt);
  }

  removeEventListener(type: string,
                      listener?: EventListenerOrEventListenerObject | null,
                      options?: EventListenerOptions | boolean): void {
    this._delegateEventTarget.removeEventListener(type, listener, options);
  }

}
