import './mocks/dom';
import { RemoteReadableStream } from '../src/remote';
import { fromWritablePort } from '../src/writable';

describe('RemoteReadableStream', () => {
  it('constructs', () => {
    const stream = new RemoteReadableStream();
    expect(stream).toBeInstanceOf(RemoteReadableStream);
    expect(stream.readable).toBeInstanceOf(ReadableStream);
    expect(stream.writablePort).toBeInstanceOf(MessagePort);
  });

  it('reads chunks from writable port', async () => {
    const stream = new RemoteReadableStream();
    const writable = fromWritablePort(stream.writablePort);

    const reader = stream.readable.getReader();
    const writer = writable.getWriter();
    const r1 = reader.read();
    const r2 = reader.read();
    const r3 = reader.read();
    void writer.write('a');
    void writer.write('b');
    void writer.write('c');

    await expect(r1).resolves.toEqual({ done: false, value: 'a' });
    await expect(r2).resolves.toEqual({ done: false, value: 'b' });
    await expect(r3).resolves.toEqual({ done: false, value: 'c' });
  });
});
