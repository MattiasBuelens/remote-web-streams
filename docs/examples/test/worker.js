importScripts('https://unpkg.com/remote-web-streams@0.1.0/dist/remote-web-streams.js');
const { fromWritablePort } = RemoteWebStreams;

onmessage = async (event) => {
  const writable = fromWritablePort(event.data);
  const writer = writable.getWriter();

  try {
    const chunks = ['a', 'b', 'c', 'd', 'e'];
    for (let chunk of chunks) {
      console.log('writer ready');
      await writer.ready;
      console.log('writer write:', chunk);
      writer.write(chunk).catch(() => {});
    }
    console.log('writer close');
    await writer.close();
  } catch (e) {
    console.error('writer error:', e);
  }
};
