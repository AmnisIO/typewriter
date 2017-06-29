import { sys, createSourceFile, resolveModuleName, ModuleKind, createProgram, CompilerOptions, CompilerHost, SourceFile, ScriptTarget, ResolvedModule, TypeChecker } from 'typescript';
import * as path from 'path';

const createCompilerHost = (options: CompilerOptions, moduleSearchLocations: string[]): CompilerHost => {
  return {
    getSourceFile,
    getDefaultLibFileName: () => "lib.d.ts",
    writeFile: (fileName, content) => sys.writeFile(fileName, content),
    getCurrentDirectory: () => sys.getCurrentDirectory(),
    getCanonicalFileName: fileName => sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
    getNewLine: () => sys.newLine,
    useCaseSensitiveFileNames: () => sys.useCaseSensitiveFileNames,
    fileExists,
    readFile,
    resolveModuleNames,
    getDirectories: () => []
  }

  function fileExists(fileName: string): boolean {
    return sys.fileExists(fileName);
  }

  function readFile(fileName: string): string {
    return sys.readFile(fileName);
  }

  function getSourceFile(fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void) {
    const sourceText = sys.readFile(fileName);
    return sourceText !== undefined ? createSourceFile(fileName, sourceText, languageVersion) : undefined;
  }

  function resolveModuleNames(moduleNames: string[], containingFile: string): ResolvedModule[] {
    return moduleNames.map(moduleName => {
      // try to use standard resolution
      let result = resolveModuleName(moduleName, containingFile, options, { fileExists, readFile });
      if (result.resolvedModule) {
        return result.resolvedModule;
      }

      // check fallback locations, for simplicity assume that module at location should be represented by '.d.ts' file
      for (const location of moduleSearchLocations) {
        const modulePath = path.join(location, moduleName + ".d.ts");
        if (fileExists(modulePath)) {
          return { resolvedFileName: modulePath }
        }
      }
      return undefined;
    });
  }
}

const defaultCompilerOptions: CompilerOptions = {
  module: ModuleKind.CommonJS,
  target: ScriptTarget.ES5,
  noLib: true,
  allowJs: false,
  noImplicitAny: true,
  noImplicitReturns: true,
  noFallthroughCasesInSwitch: true,
  noUnusedLocals: true,
  noUnusedParameters: true
};

export interface ParseResult {
  sourceFile: SourceFile;
  typeChecker: TypeChecker;
}

export const parse = (sourceFiles: string[]): ParseResult => {
  if (sourceFiles.length > 1) throw new Error('AmnisIO currently supports only one source file per project');
  const options = defaultCompilerOptions;
  const host = createCompilerHost(options, []);
  const program = createProgram(sourceFiles, options, host);
  const sourceFilesOfProgram = program.getSourceFiles();
  const sourceFile = sourceFilesOfProgram[sourceFilesOfProgram.length - 1];
  const typeChecker = program.getTypeChecker();
  return {
    sourceFile,
    typeChecker
  };
}
