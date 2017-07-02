import { parse } from './ast';
import { emitString } from './emitter';
import { transform, TypeInjectorTransformer, FunctionBlockTransformer, MethodChainTransformer } from './transformers';
import * as fs from 'fs';

declare function require(name: string): any;
declare var process: any;
const util = require('util');

export const typewrite = (file: string, outputFilePath: string): void => {
  const result = getTypeWrittenString(file);
  fs.writeFileSync(outputFilePath, result);
};

export const getTypeWrittenString = (file: string): string => {
  const { sourceFile, typeChecker } = parse([file]);
  const transformers = [
    new FunctionBlockTransformer(),
    new MethodChainTransformer(typeChecker),
    new TypeInjectorTransformer(typeChecker)
  ];
  const transformedSourceFile = transform(sourceFile, transformers);
  return emitString(transformedSourceFile, { include_headers: '' });
};
