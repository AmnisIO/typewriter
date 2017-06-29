import { ImportDeclaration, NamedImports, StringLiteral, TypeChecker } from 'typescript';
import { Context, getContext } from '../contexts';
import { EmitResult } from './';

export const emitImportDeclaration = (node: ImportDeclaration, context: Context, typeChecker?: TypeChecker): EmitResult => {
  const module_specifier = (node.moduleSpecifier as StringLiteral).text.split('/').pop();
  const module_context = getContext(module_specifier);
  const emitted_string =
    (module_context.include_headers || '')
      .split(',')
      .map(header => header.trim())
      .filter(x => !!x)
      .map(header => `#include <${header}.h>`)
      .join('\n');
  return {
    context: {
      ...context,
      ...module_context
    },
    emitted_string,
    typeChecker
  };
}
