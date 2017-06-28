import { Identifier, TypeReferenceNode, TypeChecker } from 'typescript';
import { Context } from '../contexts';
import { EmitResult, emit } from './';

export const emitIdentifier = ({ text }: Identifier, context: Context, typeChecker?: TypeChecker): EmitResult => ({
  context,
  emitted_string: sanitize(context[text] == undefined ? text : context[text])
});

export const emitType = ({ typeName }: TypeReferenceNode, context: Context, typeChecker?: TypeChecker): EmitResult => emit(typeName, context, typeChecker);

const sanitize = (value: string): string =>
  value
    .replace(/\$/g, '');
