# message-channel-stream
[Web streams][streams-spec] that work across web workers and `<iframe>`s.

## Problem
Suppose you want to process some data that you've downloaded somewhere. The processing is quite CPU-intensive,
so you want to do it inside a worker. No problem, the web has you covered with `postMessage`!

```js
// main.js
(async () => {
  const response = await fetch('./some-data.txt');
  const data = await response.text();
  const worker = new Worker('./worker.js');
  worker.onmessage = (event) => {
    const output = event.data;
    const results = document.getElementById('results');
    results.appendChild(document.createTextNode(output)); // tadaa!
  };
  worker.postMessage(data);
})();

// worker.js
self.onmessage = (event) => {
  const input = event.data;
  const output = process(input); // do the actual work
  self.postMessage(output);
}
```

All is good: your processing does not block the main thread, so your web page remains responsive. However, it takes
quite a long time before the results show up: first *all* of the data needs to be downloaded, then *all* that data
needs to be processed, and *finally* everything is shown on the page. Wouldn't it be nice if we could already show
something as soon as *some* of the data has been downloaded and processed?

Normally, you'd tackle this with by reading the input as a stream, piping it through one or more transform streams
and finally displaying the results as they come in.

```js
// main.js
(async () => {
  const response = await fetch('./some-data.txt');
  const readable = response.body;
  await readable.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(process(chunk)); // do the actual work
    }
  })).pipeTo(new WritableStream({
    write(chunk) {
      const results = document.getElementById('results');
      results.appendChild(document.createTextNode(chunk)); // tadaa!
    }
  }));
})();
```

Now you can see the first results as they come in, but your processing is blocking the main thread again!
Can we get the best of both worlds: **process data as it comes in, but off the main thread**?

## Solution
Enter: `message-channel-stream`. With this, you can create a pair of a `WritableStream` and a `ReadableStream` which
behaves like an [identity transform stream][identity-transform-stream], but where you can send one of the two ends
to a different context.
For example, your main thread can read from a `ReadableStream`, and let a worker write into the `WritableStream`.

It works by creating a `MessageChannel` between the `WritableStream` and the `ReadableStream`. The writable end sends
a message to the readable end whenever a new chunk is written, so the readable end can enqueue it for reading.
Similarly, the readable end sends a message to the writable end whenever it needs more data, so the writable end
can release any backpressure.

You can also send multiple streams to the worker. This is especially useful to run a `TransformStream` inside a worker.
In the previous example, we can create a `RemoteReadableStream` and a `RemoteWritableStream` on the main thread,
transfer those to the worker and make the worker connect those streams with a `TransformStream`. The main thread
sends and receives all data, but the actual processing happens inside the worker. Magic!

If you want, you can use two pairs of streams to first send the input from the main thread to the worker,
and then receive the output from the worker on the main thread
```js
// main.js
(async () => {
  const worker = new Worker('./worker.js');
  // create a stream to send the input to the worker
  const {writable, readablePort} = new RemoteWritableStream();
  // create a stream to receive the output from the worker
  const {readable, writablePort} = new RemoteReadableStream();
  // transfer the other ends to the worker
  worker.postMessage([readablePort, writablePort], [readablePort, writablePort]);

  const response = await fetch('./some-data.txt');
  await response.body
    // send the downloaded data to the worker
    // and receive the results back
    .pipeThrough({readable, writable})
    // show the results as they come in
    .pipeTo(new WritableStream({
      write(chunk) {
        const results = document.getElementById('results');
        results.appendChild(document.createTextNode(chunk)); // tadaa!
      }
    }));
})();

// worker.js
self.onmessage = async (event) => {
  // create the input and output streams from the transferred ports
  const [readablePort, writablePort] = event.data;
  const readable = fromReadablePort(readablePort);
  const writable = fromWritablePort(writablePort);

  // process data
  await readable
    .pipeThrough(new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(process(chunk)); // do the actual work
      }
    }))
    .pipeTo(writable); // send the results back to main thread
};
```

[streams-spec]: https://streams.spec.whatwg.org/
[fetch-spec]: https://fetch.spec.whatwg.org/
[identity-transform-stream]: https://streams.spec.whatwg.org/#identity-transform-stream
