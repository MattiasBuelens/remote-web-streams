importScripts('./process.js');
importScripts('https://unpkg.com/remote-web-streams@0.1.0/dist/remote-web-streams.js');
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
