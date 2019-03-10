import { ReadableStream, WritableStream } from 'web-streams-polyfill';
import { MockMessageChannel, MockMessagePort } from './MessageChannel';

declare global {
  interface Window {
    ReadableStream: typeof ReadableStream;
    WritableStream: typeof WritableStream;
    MessageChannel: typeof MessageChannel;
    MessagePort: typeof MessagePort;
  }
}

self.ReadableStream = ReadableStream;
self.WritableStream = WritableStream;
self.MessageChannel = MockMessageChannel;
self.MessagePort = MockMessagePort;
