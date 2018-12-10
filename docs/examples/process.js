function doSomeWork(value) {
  let sum = value;
  for (let i = 0; i < 1e6; i++) {
    sum += Math.random();
    sum -= Math.random();
  }
  return sum;
}

function processArray(input) {
  console.time('process');
  const output = input.map(doSomeWork);
  console.timeEnd('process');
  return output;
}

function processTransform() {
  return new TransformStream({
    start() {
      console.time('process');
    },
    transform(chunk, controller) {
      controller.enqueue(doSomeWork(chunk));
    },
    flush() {
      console.timeEnd('process');
    }
  });
}
