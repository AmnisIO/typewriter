import { transform as transformInternal, TransformerFactory, SourceFile, TypeChecker, visitEachChild, visitNode, Node, SyntaxKind } from 'typescript';
import { CallExpression, PropertyAccessExpression, Block, Statement, createVariableStatement, createToken, createVariableDeclaration, createIdentifier } from 'typescript';
import { Transformer } from './types';
import { path } from 'ramda';

let seed = 900;
const getRandomName = () => `__typewriter_generated_variable_${seed++}`;

export class MethodChainTransformer implements Transformer {
  getTransformer(): TransformerFactory<SourceFile> {
    return context => node => {
      const breakDownMethodChainIfNeeded = (node: Node): Node => {
        node = visitEachChild(node, breakDownMethodChainIfNeeded, context);
        switch (node.kind) {
          case SyntaxKind.CallExpression:
            {
              const expression = node as CallExpression;
              const propertyAccessExpression = expression.expression as PropertyAccessExpression;
              if (propertyAccessExpression.kind !== SyntaxKind.PropertyAccessExpression) {
                return node;
              }
              let statement = node.parent as Statement;
              while (
                statement.parent != undefined &&
                statement.kind !== SyntaxKind.ExpressionStatement &&
                statement.kind !== SyntaxKind.VariableStatement &&
                statement.kind !== SyntaxKind.ReturnStatement) {
                statement = statement.parent as Statement;
              }
              let block = statement.parent as Block;
              while (block.parent != undefined && block.kind !== SyntaxKind.Block) block = block.parent as Block;
              const index = block.statements.map((s, i) => ({ end: s.end, index: i })).filter(({ end, index }) => end < node.end).pop().index + 1;
              const name = getRandomName();
              const variableStatement = createVariableStatement(
                [createToken(SyntaxKind.ConstKeyword)],
                [createVariableDeclaration(name, undefined, propertyAccessExpression.expression)]
              );
              block.statements.splice(index, 0, variableStatement);
              propertyAccessExpression.expression = createIdentifier(name);
              return node;
            }
          default:
            return node;
        }
      };
      return visitNode(node, breakDownMethodChainIfNeeded);
    }
  }
}
