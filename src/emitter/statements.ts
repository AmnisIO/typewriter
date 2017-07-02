import { ReturnStatement, VariableStatement, ExpressionStatement, SyntaxKind, VariableDeclaration } from 'typescript';
import { Context } from '../contexts';
import { EmitResult, emit, emitString } from './';

export const emitReturnStatement = ({ expression }: ReturnStatement, context: Context): EmitResult => {
  const emit_result = emit(expression, context);
  return {
    ...emit_result,
    emitted_string: `return ${emit_result.emitted_string};`
  };
};

export const emitVariableStatement = (node: VariableStatement, context: Context): EmitResult => {
  const { declarationList } = node;
  const declarations = (<any>node).original == undefined
    ? declarationList.declarations
    : (<any>node).original.declarationList.declarations as VariableDeclaration[];
  const emitted_string =
    declarations.length === 1 && declarations[0].initializer.kind === SyntaxKind.ArrowFunction
    ? emitString(declarations[0], context)
    : declarations.map(node => emitString(node, context)).join(';\n') + ';';
  return {
    context,
    emitted_string
  };
};

export const emitExpressionStatement = ({ expression }: ExpressionStatement, context: Context): EmitResult => ({
  context,
  emitted_string: wrapRunCall(`${emitString(expression, context)};`, context)
});

const wrapRunCall = (result: string, { run, run_wrapper }: Context): string =>
  result.slice(0, run.length) !== run
    ? result
    : run_wrapper.replace(':::', result);
