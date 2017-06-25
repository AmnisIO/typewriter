import { getAST } from './ast';
import { emit } from './emitter';

declare function require(name: string);
declare var process: any;
const util = require('util');

(function () {
  if (typeof process !== 'undefined' && process.nextTick && !process.browser && typeof require !== "undefined") {
    var fs = require('fs');
    if (process.argv.length < 2)
      process.exit();
    var fileNames = process.argv.slice(2);
    const sourceFile = getAST(fileNames);
    const result = emit(sourceFile, { include_headers: '' });
    process.stdout.write(util.format.apply(null, [result.emitted_string]) + '\n');
    process.exit();
  }
})();
