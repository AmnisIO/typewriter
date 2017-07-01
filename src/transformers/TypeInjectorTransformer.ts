import { transform as transformInternal, TransformerFactory, SourceFile, TypeChecker, visitEachChild, visitNode, Node, SyntaxKind, VariableDeclaration, createTypeReferenceNode } from 'typescript';
import { Transformer } from './types';

export class TypeInjectorTransformer implements Transformer {
  private _typeChecker: TypeChecker;
  constructor(typeChecker: TypeChecker) {
    this._typeChecker = typeChecker;
  }
  getTransformer(): TransformerFactory<SourceFile> {
    return context => node => {
      const injectTypeIfNeeded = (node: Node): Node => {
        if (node.kind === SyntaxKind.VariableDeclaration) {
          const declaration = node as VariableDeclaration;
          if (declaration.type != undefined) return;
          declaration.type = createTypeReferenceNode(this._typeChecker.typeToString(this._typeChecker.getTypeAtLocation(node)), []);
        }
        return visitEachChild(node, injectTypeIfNeeded, context);
      };
      return visitNode(node, injectTypeIfNeeded);
    }
  }
}
