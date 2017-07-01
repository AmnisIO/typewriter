import { TransformerFactory, SourceFile } from 'typescript';

export interface Transformer {
  getTransformer: () => TransformerFactory<SourceFile>;
}
