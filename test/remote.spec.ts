import './mocks/dom';
import { fromWritablePort, RemoteReadableStream } from '../src';
import { isPending } from './promise-utils';
import { ReadableStreamDefaultReader, WritableStreamDefaultWriter } from 'whatwg-streams';
import { RemoteWritableStreamOptions } from '../src/remote';

describe('RemoteReadableStream', () => {
  it('constructs', () => {
    const stream = new RemoteReadableStream();
    expect(stream).toBeInstanceOf(RemoteReadableStream);
    expect(stream.readable).toBeInstanceOf(ReadableStream);
    expect(stream.writablePort).toBeInstanceOf(MessagePort);
  });

  function setup<T>(options?: RemoteWritableStreamOptions<T>): [ReadableStreamDefaultReader<T>, WritableStreamDefaultWriter<T>] {
    const stream = new RemoteReadableStream<T>();
    const writable = fromWritablePort<T>(stream.writablePort, options);
    const reader = stream.readable.getReader();
    const writer = writable.getWriter();
    return [reader, writer];
  }

  it('reads chunks from writable port', async () => {
    const [reader, writer] = setup<string>();

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
    const [reader, writer] = setup<string>();

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
    const [reader, writer] = setup<string>();

    void writer.write('a');
    void writer.write('b');
    void writer.close();

    const read1 = reader.read();
    const read2 = reader.read();
    const read3 = reader.read();
    await expect(read1).resolves.toEqual({ done: false, value: 'a' });
    await expect(read2).resolves.toEqual({ done: false, value: 'b' });
    await expect(read3).resolves.toEqual({ done: true, value: undefined });
    await expect(reader.closed).resolves.toBe(undefined);
  });

  it('cancels readable when writable aborts', async () => {
    const [reader, writer] = setup<string>();

    const reason = 'oops';
    void writer.write('a').catch(() => {});
    void writer.abort(reason);

    const read1 = reader.read();
    await expect(read1).rejects.toBe(reason);
    await expect(reader.closed).rejects.toBe(reason);
    await expect(writer.closed).rejects.toBe(reason);
  });

  it('aborts writable when readable cancels', async () => {
    const [reader, writer] = setup<string>();

    const reason = 'never mind';
    const read1 = reader.read();
    void reader.cancel(reason);

    const write1 = writer.write('a');
    await expect(read1).resolves.toEqual({ done: true, value: undefined });
    await expect(write1).rejects.toBe(reason);
    await expect(reader.closed).resolves.toBe(undefined);
    await expect(writer.closed).rejects.toBe(reason);
  });

  it('uses transferChunk callback', async () => {
    const transferChunk = jest.fn((chunk: Uint8Array) => [chunk.buffer]);
    const [reader, writer] = setup<Uint8Array>({ transferChunk });

    const read1 = reader.read();

    const chunk1 = new Uint8Array([1]);
    await writer.write(chunk1);
    expect(transferChunk).toHaveBeenLastCalledWith(chunk1);

    await expect(read1).resolves.toEqual({ done: false, value: chunk1 });
  });
});
