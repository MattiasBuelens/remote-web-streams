importScripts('./process.js');

onmessage = (event) => {
  // retrieve the transferred input and output streams
  const [readable, writable] = event.data;

  // transform input and write to output
  readable
    .pipeThrough(processTransform())
    .pipeTo(writable);
};
