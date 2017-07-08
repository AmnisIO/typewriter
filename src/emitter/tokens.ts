import { QuestionToken, ColonToken, Token, SyntaxKind, Node, LiteralLikeNode } from 'typescript';
import { Context } from '../contexts';
import { EmitResult, emit, emitString } from './';

const tokensLookup = {
  [SyntaxKind.QuestionToken]: '?',
  [SyntaxKind.EqualsEqualsEqualsToken]: '==',
  [SyntaxKind.EqualsEqualsToken]: '==',
  [SyntaxKind.ColonToken]: ':',
  [SyntaxKind.FirstAssignment]: '=',
  [SyntaxKind.PlusToken]: '+',
  [SyntaxKind.PlusPlusToken]: '++',
  [SyntaxKind.PlusEqualsToken]: '+=',
  [SyntaxKind.MinusToken]: '-',
  [SyntaxKind.MinusMinusToken]: '--',
  [SyntaxKind.MinusEqualsToken]: '-=',
  [SyntaxKind.AsteriskToken]: '*',
  [SyntaxKind.AsteriskEqualsToken]: '*=',
  [SyntaxKind.SlashToken]: '/',
  [SyntaxKind.SlashEqualsToken]: '/=',
  [SyntaxKind.PercentToken]: '%',
  [SyntaxKind.PercentEqualsToken]: '%=',
  [SyntaxKind.LessThanToken]: '<',
  [SyntaxKind.LessThanEqualsToken]: '<=',
  [SyntaxKind.GreaterThanToken]: '>',
  [SyntaxKind.GreaterThanEqualsToken]: '>=',
  [SyntaxKind.AmpersandToken]: '&',
  [SyntaxKind.AmpersandAmpersandToken]: '&&',
  [SyntaxKind.AmpersandEqualsToken]: '&=',
  [SyntaxKind.BarToken]: '|',
  [SyntaxKind.BarBarToken]: '||',
  [SyntaxKind.BarEqualsToken]: '|=',
  [SyntaxKind.EndOfFileToken]: '\n',
};

export const emitToken = <T extends SyntaxKind>(node: Token<T>, context: Context) => ({
  context,
  emitted_string: tokensLookup[node.kind as SyntaxKind]
});

export const emitFirstLiteralToken = ({ text }: LiteralLikeNode, context: Context): EmitResult => ({
  context,
  emitted_string: text
});
