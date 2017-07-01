import { transform as transformInternal, TransformerFactory, SourceFile, TypeChecker, visitEachChild, visitNode, Node, SyntaxKind } from 'typescript';
import { FunctionLikeDeclaration, createReturn, createBlock } from 'typescript';
import { Transformer } from './types';
import { path } from 'ramda';

export class FunctionBlockTransformer implements Transformer {
  getTransformer(): TransformerFactory<SourceFile> {
    return context => node => {
      const addFunctionBlockIfNeeded = (node: Node): Node => {
        switch (node.kind) {
          case SyntaxKind.ArrowFunction:
          case SyntaxKind.FunctionExpression:
          case SyntaxKind.FunctionDeclaration:
            {
              const declaration = node as FunctionLikeDeclaration;
              if (declaration.body.kind !== SyntaxKind.Block) {
                declaration.body = createBlock([createReturn(declaration.body)]);
              }
              return visitEachChild(node, addFunctionBlockIfNeeded, context);
            }
          default:
            return visitEachChild(node, addFunctionBlockIfNeeded, context);
        }
      };
      return visitNode(node, addFunctionBlockIfNeeded);
    }
  }
}
