import resolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: "src/extension.ts",
  output: {
    dir: "out/yapi-request",
    sourcemap: true,
    format: 'cjs',
    exports: 'auto',
  },
  plugins: [
    resolve(),
    typescript(),
    commonjs(),
  ],
};
