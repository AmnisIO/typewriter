import {
  Node, SyntaxKind, SourceFile, TypeReferenceNode, Identifier, Block, ExpressionStatement, BinaryExpression, PropertyAccessExpression,
  LiteralLikeNode, FunctionLikeDeclaration, ReturnStatement, VariableStatement, ImportDeclaration, VariableDeclaration, CallExpression,
  ConditionalExpression, QuestionToken, ColonToken, Token, IfStatement, PrefixUnaryExpression, PostfixUnaryExpression, KeywordTypeNode,
  ParenthesizedExpression
} from 'typescript';
import { emitImportDeclaration } from './imports';
import { emitFunctionLikeDeclaration, emitVariableDeclaration } from './declarations';
import {
  emitCallExpression, emitConditionalExpression, emitBinaryExpression, emitPropertyAccessExpression, emitPrefixUnaryExpression,
  emitPostfixUnaryExpression, emitParenthesizedExpression
} from './expressions';
import { emitToken, emitFirstLiteralToken } from './tokens';
import { emitKeyword } from './keywords';
import { emitIdentifier, emitType } from './identifiers';
import { emitBlock } from './blocks';
import { emitSourceFile } from './source';
import { emitReturnStatement, emitVariableStatement, emitExpressionStatement, emitIfStatement } from './statements';
import { Context } from '../contexts';

export interface EmitResult {
  context: Context;
  emitted_string: string;
}

const ignore = (node: Node, context: Context): EmitResult => ({
  context,
  emitted_string: `ignored_${SyntaxKind[node.kind]}`
})

export const emitString = (node: Node, context: Context): string => emit(node, context).emitted_string;

export const emit = (node: Node, context: Context): EmitResult => {
  switch (node.kind) {
    // Source
    case SyntaxKind.SourceFile:
      return emitSourceFile(<SourceFile>node, context);

    // Identifiers
    case SyntaxKind.Identifier:
      return emitIdentifier(<Identifier>node, context);

    // Names

    // Signature Elements

    // Type Members

    // Types
    case SyntaxKind.TypeReference:
      return emitType(<TypeReferenceNode>node, context);

    // Statements
    case SyntaxKind.Block:
      return emitBlock(<Block>node, context);
    case SyntaxKind.ExpressionStatement:
      return emitExpressionStatement(<ExpressionStatement>node, context);
    case SyntaxKind.ReturnStatement:
      return emitReturnStatement(<ReturnStatement>node, context);
    case SyntaxKind.VariableStatement:
      return emitVariableStatement(<VariableStatement>node, context);
    case SyntaxKind.IfStatement:
      return emitIfStatement(<IfStatement>node, context);

    // Declarations
    case SyntaxKind.ImportDeclaration:
      return emitImportDeclaration(<ImportDeclaration>node, context);
    case SyntaxKind.FunctionDeclaration:
    case SyntaxKind.ArrowFunction:
      return emitFunctionLikeDeclaration(<FunctionLikeDeclaration>node, context);
    case SyntaxKind.VariableDeclaration:
      return emitVariableDeclaration(<VariableDeclaration>node, context);

    // Expressions
    case SyntaxKind.CallExpression:
      return emitCallExpression(<CallExpression>node, context);
    case SyntaxKind.ConditionalExpression:
      return emitConditionalExpression(<ConditionalExpression>node, context);
    case SyntaxKind.BinaryExpression:
      return emitBinaryExpression(<BinaryExpression>node, context);
    case SyntaxKind.PropertyAccessExpression:
      return emitPropertyAccessExpression(<PropertyAccessExpression>node, context);
    case SyntaxKind.PrefixUnaryExpression:
      return emitPrefixUnaryExpression(<PrefixUnaryExpression>node, context);
    case SyntaxKind.PostfixUnaryExpression:
      return emitPostfixUnaryExpression(<PostfixUnaryExpression>node, context);
    case SyntaxKind.ParenthesizedExpression:
      return emitParenthesizedExpression(<ParenthesizedExpression>node, context);

    // Clauses

    // Property Assignments

    // Keywords
    case SyntaxKind.NumberKeyword:
    case SyntaxKind.BooleanKeyword:
    case SyntaxKind.TrueKeyword:
    case SyntaxKind.FalseKeyword:
      return emitKeyword(<KeywordTypeNode>node, context);

    // Tokens
    case SyntaxKind.EqualsEqualsEqualsToken:
    case SyntaxKind.EqualsEqualsToken:
    case SyntaxKind.QuestionToken:
    case SyntaxKind.ColonToken:
    case SyntaxKind.FirstAssignment:
    case SyntaxKind.PlusToken:
    case SyntaxKind.PlusPlusToken:
    case SyntaxKind.PlusEqualsToken:
    case SyntaxKind.MinusToken:
    case SyntaxKind.MinusMinusToken:
    case SyntaxKind.MinusEqualsToken:
    case SyntaxKind.AsteriskToken:
    case SyntaxKind.AsteriskEqualsToken:
    case SyntaxKind.SlashToken:
    case SyntaxKind.SlashEqualsToken:
    case SyntaxKind.PercentToken:
    case SyntaxKind.PercentEqualsToken:
    case SyntaxKind.LessThanToken:
    case SyntaxKind.LessThanEqualsToken:
    case SyntaxKind.GreaterThanToken:
    case SyntaxKind.GreaterThanEqualsToken:
    case SyntaxKind.AmpersandToken:
    case SyntaxKind.AmpersandAmpersandToken:
    case SyntaxKind.AmpersandEqualsToken:
    case SyntaxKind.BarToken:
    case SyntaxKind.BarBarToken:
    case SyntaxKind.BarEqualsToken:
      return emitToken(node as Token<SyntaxKind>, context);
    case SyntaxKind.FirstLiteralToken:
      return emitFirstLiteralToken(<LiteralLikeNode>node, context);

    // Ignore others
    default:
      return ignore(node, context);
  }
};
