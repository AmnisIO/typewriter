import { ImportDeclaration, NamedImports, StringLiteral } from 'typescript';
import { Context, getContext } from '../contexts';
import { EmitResult } from './';
import { titleCase } from 'change-case';

export const emitImportDeclaration = (node: ImportDeclaration, context: Context): EmitResult => {
  const module_specifier = (node.moduleSpecifier as StringLiteral).text.split('/').pop();
  const module_header = titleCase(module_specifier);
  const module_context = getContext(module_specifier);
  return {
    context: {
      ...context,
      ...module_context
    },
    emitted_string: `#include "Gyrus.h" // Gyrus for ${module_header}`
  };
}
