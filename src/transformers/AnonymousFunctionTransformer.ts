import {
  TransformerFactory,
  SourceFile,
  TypeChecker,
  visitEachChild,
  visitNode,
  Node,
  SyntaxKind,
  VariableDeclaration,
  createTypeReferenceNode,
  CallExpression,
  FunctionDeclaration,
  createNodeArray,
  createArrowFunction,
  createIdentifier,
  ArrowFunction,
  createVariableDeclaration,
  createVariableDeclarationList,
  createVariableStatement,
  VariableStatement,
  ParameterDeclaration,
  createParameter,
  createFunctionTypeNode
} from 'typescript';
import { Transformer } from './types';
import { path } from 'ramda';

let seed = 1;
const getNextAnonymousFunctionName = () => `_typewriter_anonymous_${seed++}`;
const addDeclarations = (statements: VariableStatement[], sourceFile: SourceFile) => {
  const index = sourceFile.statements.map((s, i) => ({ s, i })).filter(({ s, i }) => s.kind !== SyntaxKind.ImportDeclaration).shift().i;
  sourceFile.statements.splice(index, 0, ...statements);
};
export class AnonymousFunctionTransformer implements Transformer {
  private _typeChecker: TypeChecker;
  constructor(typeChecker: TypeChecker) {
    this._typeChecker = typeChecker;
  }
  getTransformer(): TransformerFactory<SourceFile> {
    const typeChecker = this._typeChecker;
    const getTypeAtLocation = typeChecker.getTypeAtLocation;
    const toString = typeChecker.typeToString;
    return context => sourceFile => {
      const statements: VariableStatement[] = [];
      const extractAnonymousFunctionIfNeeded = (node: Node): Node => {
        node = visitEachChild(node, extractAnonymousFunctionIfNeeded, context);
        if (node.kind !== SyntaxKind.CallExpression) return node;
        const callExpression = <CallExpression>node;
        if (callExpression.arguments.every(a => a.kind !== SyntaxKind.ArrowFunction)) return node;
        const updatedArguments = callExpression.arguments.map(argument => {
          if (argument.kind !== SyntaxKind.ArrowFunction) return argument;
          const { modifiers, typeParameters, equalsGreaterThanToken, body } = <ArrowFunction>argument;
          const type = getTypeAtLocation(argument);
          const typeString = toString(type);
          const typeNode = createTypeReferenceNode(typeString, []);
          const name = getNextAnonymousFunctionName();
          const parametersList = (<ArrowFunction>argument).parameters.map(parameter => {
            if (parameter.type !== undefined) return parameter;
            const type = getTypeAtLocation(parameter);
            const typeString = toString(type);
            const typeNode = createTypeReferenceNode(typeString, []);
            parameter.type = typeNode;
            return parameter;
          });
          const parameters = createNodeArray(parametersList);
          const functionType = createFunctionTypeNode(typeParameters, parameters, typeNode);
          const arrowFunction = createArrowFunction(
            modifiers,
            typeParameters,
            parameters,
            functionType,
            equalsGreaterThanToken,
            body
          );
          (<any>arrowFunction).original = argument;
          const declaration = createVariableDeclaration(name, functionType, arrowFunction);
          const declarations = createVariableDeclarationList([declaration]);
          const statement = createVariableStatement(undefined, declarations);
          statements.push(statement);
          const substituteArgument = createIdentifier(name);
          (<any>substituteArgument).original = argument;
          return substituteArgument;
        });
        callExpression.arguments = createNodeArray(updatedArguments);
        return node;
      };
      sourceFile = visitNode(sourceFile, extractAnonymousFunctionIfNeeded);
      addDeclarations(statements, sourceFile);
      return sourceFile;
    }
  }
}
