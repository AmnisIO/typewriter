import { Transformer } from './types';
import { TransformerFactory, SourceFile } from 'typescript';

export class DummyTransformer implements Transformer {
  getTransformer(): TransformerFactory<SourceFile> {
    return context => node => node;
  }
}
