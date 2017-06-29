import { SyntaxKind, CallExpression, Identifier, ConditionalExpression, BinaryExpression, PropertyAccessExpression, TypeChecker } from 'typescript';
import { Context } from '../contexts';
import { EmitResult, emit, emitString } from './';

export const emitCallExpression = ({ expression, ...node }: CallExpression, context: Context, typeChecker?: TypeChecker) => {
  const args =
    expression.kind === SyntaxKind.PropertyAccessExpression
      ? [(<PropertyAccessExpression>expression).expression, ...node.arguments]
      : node.arguments;
  const emitted_string = `${emitString(expression, context, typeChecker)}(${args.map(arg => emitString(arg, context, typeChecker)).join(', ')})`;
  return {
    context,
    emitted_string,
    typeChecker
  };
};;

export const emitConditionalExpression = ({ condition, questionToken, whenTrue, colonToken, whenFalse }: ConditionalExpression, context: Context, typeChecker?: TypeChecker): EmitResult => ({
  context,
  emitted_string: `${emitString(condition, context, typeChecker)} ${emitString(questionToken, context, typeChecker)} ${emitString(whenTrue, context, typeChecker)} ${emitString(colonToken, context, typeChecker)} ${emitString(whenFalse, context, typeChecker)}`,
  typeChecker
});

export const emitBinaryExpression = ({ left, right, operatorToken }: BinaryExpression, context: Context, typeChecker?: TypeChecker): EmitResult => ({
  context,
  emitted_string: `${emitString(left, context, typeChecker)} ${emitString(operatorToken, context, typeChecker)} ${emitString(right, context, typeChecker)}`,
  typeChecker
});

export const emitPropertyAccessExpression = ({ name, expression }: PropertyAccessExpression, context: Context, typeChecker?: TypeChecker): EmitResult => ({
  context,
  emitted_string: `${emitString(expression, context, typeChecker)}->${emitString(name, context, typeChecker)}`,
  typeChecker
});
