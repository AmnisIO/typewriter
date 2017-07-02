import {
  TransformerFactory,
  SourceFile,
  TypeChecker,
  visitEachChild,
  visitNode,
  Node,
  SyntaxKind,
  VariableDeclaration,
  FunctionLikeDeclaration,
  createTypeReferenceNode,
  createFunctionTypeNode,
  createNodeArray
} from 'typescript';
import { Transformer } from './types';
import { path } from 'ramda';

export class TypeInjectorTransformer implements Transformer {
  private _typeChecker: TypeChecker;
  constructor(typeChecker: TypeChecker) {
    this._typeChecker = typeChecker;
  }
  getTransformer(): TransformerFactory<SourceFile> {
    const typeChecker = this._typeChecker;
    const getTypeAtLocation = typeChecker.getTypeAtLocation;
    const toString = typeChecker.typeToString;
    return context => node => {
      const injectTypeIfNeeded = (node: Node): Node => {
        switch (node.kind) {
          case SyntaxKind.VariableDeclaration:
            {
              const declaration = node as VariableDeclaration;
              if (declaration.type != undefined) return;
              const type = getTypeAtLocation(node);
              const typeString = toString(type);
              declaration.type = createTypeReferenceNode(typeString, []);
              return visitEachChild(node, injectTypeIfNeeded, context);
            }
          case SyntaxKind.FunctionDeclaration:
          case SyntaxKind.ArrowFunction:
            {
              const declaration = node as FunctionLikeDeclaration;
              if (declaration.type != undefined) return;
              const type = getTypeAtLocation(node);
              const typeString = toString(type);
              const split = typeString.split('=>').map(s => s.trim());
              const returnType = createTypeReferenceNode(split[1], []);
              const parametersList = declaration.parameters.map(parameter => {
                if (parameter.type !== undefined) return parameter;
                const type = getTypeAtLocation(parameter);
                const typeString = toString(type);
                const typeNode = createTypeReferenceNode(typeString, []);
                parameter.type = typeNode;
                return parameter;
              });
              const parameters = createNodeArray(parametersList);
              const functionType = createFunctionTypeNode([], parameters, returnType);
              declaration.type = functionType;
              return visitEachChild(node, injectTypeIfNeeded, context);
            }
          default:
            return visitEachChild(node, injectTypeIfNeeded, context);
        }
      };
      return visitNode(node, injectTypeIfNeeded);
    }
  }
}
