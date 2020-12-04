import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';

export default {
  input: 'http-src/index.js',
  output: {
    file: 'http/bundle.js',
    format: 'cjs'
  },
  plugins: [
    json(),
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' }
      ]
    }),
    commonjs(),
    nodeResolve()
  ]
};