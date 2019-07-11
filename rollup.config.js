import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';

export default [{
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
    typescript({
      tsconfig: './tsconfig.json'
    })
  ]
}, {
  input: './src/index.ts',
  output: [{
    file: './dist/types/index.d.ts',
    format: 'es'
  }],
  plugins: [
    dts({
      tsconfig: './tsconfig.json'
    })
  ]
}];
