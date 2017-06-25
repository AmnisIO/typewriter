import { getAST } from './ast';
import { emit } from './emitter';
import * as fs from 'fs';

declare function require(name: string): any;
declare var process: any;
const util = require('util');

export const typewrite = (file: string, output: string): void => {
  const sourceFile = getAST([file]);
  const result = emit(sourceFile, { include_headers: '' });
  fs.writeFileSync(output, result.emitted_string);
};

export default typewrite;