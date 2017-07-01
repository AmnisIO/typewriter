import { FunctionLikeDeclaration, Identifier, TypeReferenceNode, VariableDeclaration, SyntaxKind, ArrowFunction, Block, Expression, createBlock, createStatement, createReturn, createTypeReferenceNode } from 'typescript';
import { Context } from '../contexts';
import { EmitResult, emit, emitString } from './';

const emitFunctionDeclaration = (node: FunctionLikeDeclaration, context: Context): string => {
  const type = node.type;
  const return_type = emitString(type, context);
  const function_name = emitString(node.name, context);
  // TODO: Move to parameter node emit
  const parameters =
    node.parameters
      .map(p => ({ name: emitString(p.name, context), type: emitString(p.type, context) }))
      .map(({ name, type }) => `${type} ${name}`)
      .join(', ');
  const body =
    node.body.kind === SyntaxKind.Block
      ? emitString(node.body, context)
      : emitString(createBlock([createReturn(node.body)]), context)
  const declaration = `${return_type} ${function_name}(${parameters}) ${body}`;
  return declaration;
};

export const emitFunctionLikeDeclaration = (node: FunctionLikeDeclaration, context: Context): EmitResult => {
  return {
    context,
    emitted_string: emitFunctionDeclaration(node, context)
  };
}

export const emitVariableDeclaration = (node: VariableDeclaration, context: Context): EmitResult => {
  const type = node.type;
  const emitted_string =
    node.initializer.kind === SyntaxKind.ArrowFunction
      ? emitString({ ...node.initializer, name: node.name }, context)
      : `${emitString(type, context)} ${emitString(node.name, context)} = ${emitString(node.initializer, context)}`;
  return {
    context,
    emitted_string
  };
};
