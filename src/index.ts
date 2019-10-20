import { RemoteWritableStreamOptions as RemoteWritableStreamOptionsType } from './remote';

export type RemoteWritableStreamOptions<W = any> = RemoteWritableStreamOptionsType<W>;

export {
  RemoteReadableStream,
  RemoteWritableStream
} from './remote';
export { fromReadablePort } from './readable';
export { fromWritablePort } from './writable';
