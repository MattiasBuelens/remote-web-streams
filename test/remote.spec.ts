import './mocks/dom';
import { fromWritablePort, RemoteReadableStream } from '../src';
import { isPending } from './promise-utils';

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

    const read1 = reader.read();
    const read2 = reader.read();
    const read3 = reader.read();
    void writer.write('a');
    void writer.write('b');
    void writer.write('c');

    await expect(read1).resolves.toEqual({ done: false, value: 'a' });
    await expect(read2).resolves.toEqual({ done: false, value: 'b' });
    await expect(read3).resolves.toEqual({ done: false, value: 'c' });
  });

  it('respects backpressure', async () => {
    const stream = new RemoteReadableStream();
    const writable = fromWritablePort(stream.writablePort);
    const reader = stream.readable.getReader();
    const writer = writable.getWriter();

    const ready1 = writer.ready;
    const write1 = writer.write('a');
    const ready2 = writer.ready;
    const write2 = writer.write('b');
    const ready3 = writer.ready;
    await Promise.all([
      expect(ready1).resolves.toBe(undefined),
      expect(isPending(write1)).resolves.toBe(true),
      expect(isPending(ready2)).resolves.toBe(true),
      expect(isPending(write2)).resolves.toBe(true),
      expect(isPending(ready3)).resolves.toBe(true)
    ]);

    const read1 = reader.read();
    await Promise.all([
      expect(read1).resolves.toEqual({ done: false, value: 'a' }),
      expect(write1).resolves.toBe(undefined),
      expect(isPending(ready2)).resolves.toBe(true),
      expect(isPending(write2)).resolves.toBe(true),
      expect(isPending(ready3)).resolves.toBe(true)
    ]);

    const read2 = reader.read();
    await Promise.all([
      expect(read2).resolves.toEqual({ done: false, value: 'b' }),
      expect(write2).resolves.toBe(undefined),
      expect(isPending(ready2)).resolves.toBe(true),
      expect(isPending(ready3)).resolves.toBe(true)
    ]);

    await Promise.all([
      expect(ready2).resolves.toBe(undefined),
      expect(ready3).resolves.toBe(undefined)
    ]);
  });

  it('propagates close', async () => {
    const stream = new RemoteReadableStream();
    const writable = fromWritablePort(stream.writablePort);
    const reader = stream.readable.getReader();
    const writer = writable.getWriter();

    writer.write('a');
    writer.write('b');
    writer.close();

    const read1 = reader.read();
    const read2 = reader.read();
    const read3 = reader.read();
    await expect(read1).resolves.toEqual({ done: false, value: 'a' });
    await expect(read2).resolves.toEqual({ done: false, value: 'b' });
    await expect(read3).resolves.toEqual({ done: true, value: undefined });
    await expect(reader.closed).resolves.toBe(undefined);
  });

  it('cancels readable when writable aborts', async () => {
    const stream = new RemoteReadableStream();
    const writable = fromWritablePort(stream.writablePort);
    const reader = stream.readable.getReader();
    const writer = writable.getWriter();

    const reason = 'oops';
    void writer.write('a').catch(() => {});
    void writer.abort(reason);

    const read1 = reader.read();
    await expect(read1).rejects.toBe(reason);
    await expect(reader.closed).rejects.toBe(reason);
    await expect(writer.closed).rejects.toBe(reason);
  });

  it('aborts writable when readable cancels', async () => {
    const stream = new RemoteReadableStream();
    const writable = fromWritablePort(stream.writablePort);
    const reader = stream.readable.getReader();
    const writer = writable.getWriter();

    const reason = 'never mind';
    const read1 = reader.read();
    void reader.cancel(reason);

    const write1 = writer.write('a');
    await expect(read1).resolves.toEqual({ done: true, value: undefined });
    await expect(write1).rejects.toBe(reason);
    await expect(reader.closed).resolves.toBe(undefined);
    await expect(writer.closed).rejects.toBe(reason);
  });
});
