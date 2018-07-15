importScripts('./process.js');
importScripts('../../dist/remote-web-streams.js');
const { fromReadablePort, fromWritablePort } = RemoteWebStreams;

onmessage = (event) => {
  // create the input and output streams from the transferred ports
  const [readablePort, writablePort] = event.data;
  const readable = fromReadablePort(readablePort);
  const writable = fromWritablePort(writablePort);

  // transform input and write to output
  readable
    .pipeThrough(processTransform())
    .pipeTo(writable);
};
