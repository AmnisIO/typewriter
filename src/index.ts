import { getAST } from './ast';
import { emitString } from './emitter';
import * as fs from 'fs';

declare function require(name: string): any;
declare var process: any;
const util = require('util');

export const typewrite = (file: string, outputFilePath: string): void => {
  const result = getTypeWrittenString(file);
  fs.writeFileSync(outputFilePath, result);
};

export const getTypeWrittenString = (file: string): string =>
  emitString(getAST([file]), { include_headers: '' });