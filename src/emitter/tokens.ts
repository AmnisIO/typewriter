import { QuestionToken, ColonToken, Token, SyntaxKind, Node, LiteralLikeNode, TypeChecker } from 'typescript';
import { Context } from '../contexts';
import { EmitResult, emit, emitString } from './';

export const emitQuestionToken = (node: QuestionToken, context: Context, typeChecker: TypeChecker): EmitResult => ({
  context,
  emitted_string: '?',
  typeChecker
});

export const emitColonToken = (node: ColonToken, context: Context, typeChecker: TypeChecker): EmitResult => ({
  context,
  emitted_string: ':',
  typeChecker
});

export const emitEqualsEqualsToken = (node: Node, context: Context, typeChecker: TypeChecker): EmitResult => ({
  context,
  emitted_string: '==',
  typeChecker
});

export const emitFirstAssignmentToken = (node: Node, context: Context, typeChecker: TypeChecker): EmitResult => ({
  context,
  emitted_string: '=',
  typeChecker
});

export const emitFirstLiteralToken = ({ text }: LiteralLikeNode, context: Context, typeChecker: TypeChecker): EmitResult => ({
  context,
  emitted_string: text,
  typeChecker
});
