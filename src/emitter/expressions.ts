import {
  SyntaxKind, CallExpression, Identifier, ConditionalExpression, BinaryExpression, PropertyAccessExpression, PrefixUnaryExpression,
  PostfixUnaryExpression, createToken
} from 'typescript';
import { Context } from '../contexts';
import { EmitResult, emit, emitString } from './';
import { emitToken } from './tokens';

export const emitCallExpression = ({ expression, ...node }: CallExpression, context: Context) => {
  const args =
    expression.kind === SyntaxKind.PropertyAccessExpression
      ? [(<PropertyAccessExpression>expression).expression, ...node.arguments]
      : node.arguments;
  const emitted_string = `${emitString(expression, context)}(${args.map(arg => emitString(arg, context)).join(', ')})`;
  return {
    context,
    emitted_string
  };
};;

export const emitConditionalExpression = ({ condition, questionToken, whenTrue, colonToken, whenFalse }: ConditionalExpression, context: Context): EmitResult => ({
  context,
  emitted_string: `${emitString(condition, context)} ${emitString(questionToken, context)} ${emitString(whenTrue, context)} ${emitString(colonToken, context)} ${emitString(whenFalse, context)}`
});

export const emitBinaryExpression = ({ left, right, operatorToken }: BinaryExpression, context: Context): EmitResult => ({
  context,
  emitted_string: `${emitString(left, context)} ${emitString(operatorToken, context)} ${emitString(right, context)}`
});

export const emitPropertyAccessExpression = ({ name, expression }: PropertyAccessExpression, context: Context): EmitResult => ({
  context,
  emitted_string: `${emitString(expression, context)}->${emitString(name, context)}`
});

export const emitPrefixUnaryExpression = ({ operand, operator }: PrefixUnaryExpression, context: Context): EmitResult => ({
  context,
  emitted_string: `${emitString(createToken(operator), context)}${emitString(operand, context)}`
});

export const emitPostfixUnaryExpression = ({ operand, operator }: PostfixUnaryExpression, context: Context): EmitResult => ({
  context,
  emitted_string: `${emitString(operand, context)}${emitString(createToken(operator), context)}`
});
