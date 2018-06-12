import './mocks/dom';
import { RemoteReadableStream } from '../src/remote';

describe('RemoteReadableStream', () => {
  it('constructs', () => {
    const stream = new RemoteReadableStream();
    expect(stream).toBeInstanceOf(RemoteReadableStream);
  });
});
