import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const config = [
  {
    input: 'build/compiled/index.js',
    output: {
      file: 'build/index.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [typescript()]
  },
  {
    input: 'build/compiled/index.d.ts',
    output: {
      file: 'build/index.d.ts',
      format: 'es'
    },
    plugins: [dts.default()]
  }
];
export default config;
