import { EmitResult, emit } from './';
import { Context } from '../contexts';
import { SourceFile } from 'typescript';

export const emitSourceFile = (node: SourceFile, context: Context): EmitResult =>
  node.statements
    .reduce<EmitResult>(({ context, emitted_string }, node) => {
      const result = emit(node, context);
      if (!result.emitted_string) return result;
      result.emitted_string = emitted_string + '\n\n' + result.emitted_string;
      return result;
    }, { context, emitted_string: '' });
