const typescript = require('rollup-plugin-typescript2');

module.exports = {
  input: './src/index.ts',
  output: {
    file: './dist/message-channel-stream.js',
    format: 'umd',
    name: 'MessageChannelStream'
  },
  plugins: [
    typescript()
  ]
};
