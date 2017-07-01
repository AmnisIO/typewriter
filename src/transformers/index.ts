import { Transformer } from './types';
import { transform as transformInternal, SourceFile } from 'typescript';
export { TypeInjectorTransformer } from './TypeInjectorTransformer';
export { FunctionBlockTransformer } from './FunctionBlockTransformer';

export const transform = (sourceFile: SourceFile, transformers: Transformer[]) =>
  transformInternal(sourceFile, transformers.map(t => t.getTransformer())).transformed.shift();
