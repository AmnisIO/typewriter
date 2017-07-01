import { FunctionLikeDeclaration, Identifier, TypeReferenceNode, VariableDeclaration, SyntaxKind, ArrowFunction, Block, Expression, createBlock, createStatement, createReturn, TypeChecker, createTypeReferenceNode } from 'typescript';
import { Context } from '../contexts';
import { EmitResult, emit, emitString } from './';

const emitFunctionDeclaration = (node: FunctionLikeDeclaration, context: Context, typeChecker: TypeChecker): string => {
  const type = node.type;
  const return_type = emitString(type, context, typeChecker);
  const function_name = emitString(node.name, context, typeChecker);
  // TODO: Move to parameter node emit
  const parameters =
    node.parameters
      .map(p => ({ name: emitString(p.name, context, typeChecker), type: emitString(p.type, context, typeChecker) }))
      .map(({ name, type }) => `${type} ${name}`)
      .join(', ');
  const body =
    node.body.kind === SyntaxKind.Block
      ? emitString(node.body, context, typeChecker)
      : emitString(createBlock([createReturn(node.body)]), context, typeChecker)
  const declaration = `${return_type} ${function_name}(${parameters}) ${body}`;
  return declaration;
};

export const emitFunctionLikeDeclaration = (node: FunctionLikeDeclaration, context: Context, typeChecker: TypeChecker): EmitResult => {
  return {
    context,
    emitted_string: emitFunctionDeclaration(node, context, typeChecker),
    typeChecker
  };
}

export const emitVariableDeclaration = (node: VariableDeclaration, context: Context, typeChecker: TypeChecker): EmitResult => {
  const type = node.type;
  const emitted_string =
    node.initializer.kind === SyntaxKind.ArrowFunction
      ? emitString({ ...node.initializer, name: node.name }, context, typeChecker)
      : `${emitString(type, context, typeChecker)} ${emitString(node.name, context, typeChecker)} = ${emitString(node.initializer, context, typeChecker)}`;
  return {
    context,
    emitted_string,
    typeChecker
  };
};
