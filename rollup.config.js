import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import executable from "rollup-plugin-executable";
import json from "rollup-plugin-json";
import cleanup from "rollup-plugin-cleanup";
import builtins from "builtin-modules";
import pkg from "./package.json";

const external = [...buildins];

export default [
  ...Object.keys(pkg.bin || {}).map(name => {
    return {
      input: `src/${name}-cli.mjs`,
      output: {
        file: pkg.bin[name],
        format: "cjs",
        banner:
          '#!/bin/sh\n":" //# comment; exec /usr/bin/env node --experimental-modules "$0" "$@"',
        interop: false
      },
      plugins: [
        commonjs(),
        json({
          include: "package.json",
          preferConst: true,
          compact: true
        }),
        cleanup({
          extensions: ['js','mjs','jsx','tag']
        }),
        executable()
      ],
      external
    };
  }),
  {
    input: pkg.module,
    output: {
      file: pkg.main,
      format: "cjs",
      interop: false
    },
    plugins: [resolve(), commonjs(), cleanup()]
  }
];
