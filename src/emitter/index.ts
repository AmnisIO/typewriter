import { Node, SyntaxKind, SourceFile, TypeReferenceNode, Identifier, Block, ExpressionStatement, BinaryExpression, PropertyAccessExpression, LiteralLikeNode, FunctionLikeDeclaration, TypeChecker, ReturnStatement, VariableStatement, ImportDeclaration, VariableDeclaration, CallExpression, ConditionalExpression, QuestionToken, ColonToken, Token } from 'typescript';
import { emitImportDeclaration } from './imports';
import { emitFunctionLikeDeclaration, emitVariableDeclaration } from './declarations';
import { emitCallExpression, emitConditionalExpression, emitBinaryExpression, emitPropertyAccessExpression } from './expressions';
import { emitColonToken, emitQuestionToken, emitEqualsEqualsToken, emitFirstAssignmentToken, emitFirstLiteralToken } from './tokens';
import { emitIdentifier, emitType } from './identifiers';
import { emitBlock } from './blocks';
import { emitSourceFile } from './source';
import { emitReturnStatement, emitVariableStatement, emitExpressionStatement } from './statements';
import { Context } from '../contexts';

export interface EmitResult {
  context: Context;
  emitted_string: string;
  typeChecker?: TypeChecker;
}

const ignore = (node: Node, context: Context, typeChecker: TypeChecker): EmitResult => ({
  context,
  emitted_string: `ignored_${SyntaxKind[node.kind]}`,
  typeChecker
})

export const emitString = (node: Node, context: Context, typeChecker?: TypeChecker): string => emit(node, context).emitted_string;

export const emit = (node: Node, context: Context, typeChecker?: TypeChecker): EmitResult => {
  switch (node.kind) {
    // Source
    case SyntaxKind.SourceFile:
      return emitSourceFile(<SourceFile>node, context, typeChecker);

    // Identifiers
    case SyntaxKind.Identifier:
      return emitIdentifier(<Identifier>node, context, typeChecker);

    // Names

    // Signature Elements

    // Type Members

    // Types
    case SyntaxKind.TypeReference:
      return emitType(<TypeReferenceNode>node, context, typeChecker);

    // Statements
    case SyntaxKind.Block:
      return emitBlock(<Block>node, context, typeChecker);
    case SyntaxKind.ExpressionStatement:
      return emitExpressionStatement(<ExpressionStatement>node, context, typeChecker);
    case SyntaxKind.ReturnStatement:
      return emitReturnStatement(<ReturnStatement>node, context, typeChecker);
    case SyntaxKind.VariableStatement:
      return emitVariableStatement(<VariableStatement>node, context, typeChecker);

    // Declarations
    case SyntaxKind.ImportDeclaration:
      return emitImportDeclaration(<ImportDeclaration>node, context, typeChecker);
    case SyntaxKind.FunctionDeclaration:
    case SyntaxKind.ArrowFunction:
      return emitFunctionLikeDeclaration(<FunctionLikeDeclaration>node, context, typeChecker);
    case SyntaxKind.VariableDeclaration:
      return emitVariableDeclaration(<VariableDeclaration>node, context, typeChecker);

    // Expressions
    case SyntaxKind.CallExpression:
      return emitCallExpression(<CallExpression>node, context, typeChecker);
    case SyntaxKind.ConditionalExpression:
      return emitConditionalExpression(<ConditionalExpression>node, context, typeChecker);
    case SyntaxKind.BinaryExpression:
      return emitBinaryExpression(<BinaryExpression>node, context, typeChecker);
    case SyntaxKind.PropertyAccessExpression:
      return emitPropertyAccessExpression(<PropertyAccessExpression>node, context, typeChecker);

    // Clauses

    // Property Assignments

    // Tokens
    case SyntaxKind.EqualsEqualsEqualsToken:
    case SyntaxKind.EqualsEqualsToken:
      return emitEqualsEqualsToken(node, context, typeChecker);
    case SyntaxKind.QuestionToken:
      return emitQuestionToken(<QuestionToken>node, context, typeChecker);
    case SyntaxKind.ColonToken:
      return emitColonToken(<ColonToken>node, context, typeChecker);
    case SyntaxKind.FirstAssignment:
      return emitFirstAssignmentToken(node, context, typeChecker);
    case SyntaxKind.FirstLiteralToken:
      return emitFirstLiteralToken(<LiteralLikeNode>node, context, typeChecker);
    case SyntaxKind.EndOfFileToken:
      return { context, emitted_string: '\n', typeChecker };

    // Ignore others
    default:
      return ignore(node, context, typeChecker);
  }
};
