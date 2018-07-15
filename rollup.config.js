const typescript = require('rollup-plugin-typescript2');

module.exports = {
  input: './src/index.ts',
  output: [{
    file: './dist/remote-web-streams.js',
    format: 'umd',
    name: 'RemoteWebStreams'
  }, {
    file: './dist/remote-web-streams.mjs',
    format: 'es'
  }],
  plugins: [
    typescript()
  ]
};
