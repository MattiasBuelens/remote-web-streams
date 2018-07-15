function arrayToStream(array) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  for (let item of array) {
    writer.write(item);
  }
  writer.close();
  return readable;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function delayTransform(ms) {
  return new TransformStream({
    transform(chunk, controller) {
      return delay(ms).then(() => controller.enqueue(chunk));
    }
  });
}

function printArrayToElement(element, array) {
  element.appendChild(document.createTextNode(array.join('\n') + '\n\n'));
}

function printToElementStream(element) {
  return new WritableStream({
    write(chunk) {
      element.appendChild(document.createTextNode(chunk + '\n'));
    },
    close() {
      element.appendChild(document.createTextNode('\n'));
    }
  });
}
