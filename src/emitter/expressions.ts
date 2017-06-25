import { SyntaxKind, CallExpression, Identifier, ConditionalExpression, BinaryExpression, PropertyAccessExpression } from 'typescript';
import { Context } from '../contexts';
import { EmitResult, emit, emitString } from './';

export const emitCallExpression = ({ expression, ...node }: CallExpression, context: Context) => {
  let self_reference_emit = '';
  if (expression.kind === SyntaxKind.PropertyAccessExpression) {
    const self_reference = (expression as PropertyAccessExpression).expression;
    self_reference_emit = emitString(self_reference, context) + ', ';
  }
  const emitted_string = `${emitString(expression, context)}(${self_reference_emit}${node.arguments.map(arg => emitString(arg, context)).join(', ')})`;
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
