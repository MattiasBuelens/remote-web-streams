importScripts('./process.js');
importScripts('../dist/message-channel-stream.js');
const { fromReadablePort, fromWritablePort } = MessageChannelStream;

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
