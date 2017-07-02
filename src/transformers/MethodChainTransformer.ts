import { TransformerFactory, SourceFile, TypeChecker, visitEachChild, visitNode, Node, SyntaxKind, CallExpression, PropertyAccessExpression } from 'typescript';
import { Block, Statement, createVariableStatement, createToken, createVariableDeclaration, createIdentifier, TypeNode, createTypeReferenceNode } from 'typescript';
import { createVariableDeclarationList } from 'typescript';
import { Transformer } from './types';
import { path } from 'ramda';

let seed = 1;
const getNextTemporaryVariableName = () => `_typewriter_intermediary_${seed++}`;
const getParentStatement = (node: Node): Statement => {
  let statement = node.parent as Statement;
  while (
    statement.parent != undefined &&
    statement.kind !== SyntaxKind.ExpressionStatement &&
    statement.kind !== SyntaxKind.VariableStatement &&
    statement.kind !== SyntaxKind.ReturnStatement) {
    statement = statement.parent as Statement;
  }
  return statement;
}
const getParentBlock = (node: Node): Block => {
  let block = node.parent as Block;
  while (block.parent != undefined && block.kind !== SyntaxKind.Block) block = block.parent as Block;
  return block;
}
export class MethodChainTransformer implements Transformer {
  private _typeChecker: TypeChecker;
  constructor(typeChecker: TypeChecker) {
    this._typeChecker = typeChecker;
  }
  getTransformer(): TransformerFactory<SourceFile> {
    const typeChecker = this._typeChecker;
    const getTypeAtLocation = typeChecker.getTypeAtLocation;
    const toString = typeChecker.typeToString;
    return context => node => {
      const breakDownMethodChainIfNeeded = (node: Node): Node => {
        // Ignore generated nodes
        if (node.pos === -1) return node;
        node = visitEachChild(node, breakDownMethodChainIfNeeded, context);
        if (node.kind !== SyntaxKind.CallExpression) return node;
        const callExpression = <CallExpression>node;
        if (callExpression.expression.kind !== SyntaxKind.PropertyAccessExpression) return node;
        const propertyAccessExpression = <PropertyAccessExpression>callExpression.expression;
        if (propertyAccessExpression.expression.kind !== SyntaxKind.CallExpression) return node;
        const statement = getParentStatement(node);
        const block = getParentBlock(node);
        const index = block.statements.map((s, i) => ({ end: s.end, index: i })).filter(({ end, index }) => end < node.end).pop().index + 1;
        const name = getNextTemporaryVariableName();
        let typeNode: TypeNode = undefined;
        try {
          const type = getTypeAtLocation(node);
          typeNode = createTypeReferenceNode(toString(type), []);
        }
        catch (err) {
          typeNode = createTypeReferenceNode('Rivulet<Byte>', []);
        }
        const variableDeclaration = createVariableDeclaration(name, typeNode, propertyAccessExpression.expression);
        const variableDeclarationList = createVariableDeclarationList([variableDeclaration]);
        const variableStatement = createVariableStatement(undefined, variableDeclarationList);
        block.statements.splice(index, 0, variableStatement);
        const identifierToVariable = createIdentifier(name);
        (<any>identifierToVariable).original = propertyAccessExpression.expression;
        propertyAccessExpression.expression = identifierToVariable;
        return node;
      };
      return visitNode(node, breakDownMethodChainIfNeeded);
    }
  }
}
