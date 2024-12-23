import path from 'path'
import { transformFileSync } from '@babel/core'
import consoleInsertPlugin from './plugin/console-insert-plugin.js';

const sourceCode = transformFileSync(new URL('./code.js', import.meta.url).pathname, {
  plugins: [
    consoleInsertPlugin
  ],
  parserOpts: {
    sourceType: 'unambiguous',
    plugins: ['jsx']
  }
}).code;

console.log(sourceCode);