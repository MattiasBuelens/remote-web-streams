const typescript = require('rollup-plugin-typescript2');

module.exports = {
  input: './src/index.ts',
  output: {
    file: './dist/channel-stream.js',
    format: 'umd',
    name: 'ChannelStream'
  },
  plugins: [
    typescript()
  ]
};
