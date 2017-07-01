import { transform as transformInternal, TransformerFactory, SourceFile, TypeChecker, visitEachChild, visitNode, Node, SyntaxKind } from 'typescript';
import { CallExpression, PropertyAccessExpression, Block, Statement, createVariableStatement, createToken, createVariableDeclaration, createIdentifier } from 'typescript';
import { Transformer } from './types';
import { path } from 'ramda';

let seed = 1;
const getNextTemporaryVariableName = () => `__typewriter_${seed++}`;
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
  getTransformer(): TransformerFactory<SourceFile> {
    return context => node => {
      const breakDownMethodChainIfNeeded = (node: Node): Node => {
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
        const variableStatement = createVariableStatement(
          [createToken(SyntaxKind.ConstKeyword)],
          // TODO: Get the type of the variable here
          [createVariableDeclaration(name, undefined, propertyAccessExpression.expression)]
        );
        block.statements.splice(index, 0, variableStatement);
        propertyAccessExpression.expression = createIdentifier(name);
        return node;
      };
      return visitNode(node, breakDownMethodChainIfNeeded);
    }
  }
}
