import { ImportDeclaration, NamedImports, StringLiteral } from 'typescript';
import { Context, getContext } from '../contexts';
import { EmitResult } from './';
import { pascalCase } from 'change-case';

export const emitImportDeclaration = (node: ImportDeclaration, context: Context): EmitResult => {
  const module_specifier = (node.moduleSpecifier as StringLiteral).text.split('/').pop();
  const module_header = pascalCase(module_specifier.split('-').join(' '));
  const module_context = getContext(module_specifier);
  return {
    context: {
      ...context,
      ...module_context
    },
    emitted_string: `#include "Gyrus${module_header}.h"`
  };
}
