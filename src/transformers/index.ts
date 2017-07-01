import { Transformer } from './types';
import { transform as transformInternal, SourceFile } from 'typescript';
export { DummyTransformer } from './DummyTransformer';
export { TypeInjectorTransformer } from './TypeInjectorTransformer';

export const transform = (sourceFile: SourceFile, transformers: Transformer[]) =>
  transformInternal(sourceFile, transformers.map(t => t.getTransformer())).transformed.shift();
