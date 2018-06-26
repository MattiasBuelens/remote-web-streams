importScripts('./process.js');

onmessage = (event) => {
  const input = event.data;
  const output = processArray(input);
  self.postMessage(output);
};
