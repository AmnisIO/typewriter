import { SyntaxKind, KeywordTypeNode } from 'typescript';
import { Context } from '../contexts';
import { EmitResult, emit } from './';

const keywordsLookup = {
  [SyntaxKind.NumberKeyword]: 'number',
  [SyntaxKind.BooleanKeyword]: 'boolean',
  [SyntaxKind.TrueKeyword]: 'true',
  [SyntaxKind.FalseKeyword]: 'false'
};

export const emitKeyword = ({ kind }: KeywordTypeNode, context: Context): EmitResult => {
  const text = keywordsLookup[kind];
  const emitted_string = context[text] == undefined ? text : context[text];
  return {
    context,
    emitted_string
  };
};
