#!/usr/bin/env node
var path = require('path');

try {
    var localTypewriter = require.resolve(path.join(process.cwd(), 'node_modules', '@amnisio', 'typewriter', 'dist', 'bin', 'typewriter.js'));
    if (__filename !== localTypewriter) {
        return require(localTypewriter);
    }
} catch (e) { }

var yargs = require('yargs')
	.usage('typewriter ' + require('../package.json').version + '\n' +
		'Usage: typewriter --file <entry> --outfile <output>\n');

var argv = yargs.argv;

var typewriterOptions = {
  file: '',
  outputFilePath: './typewritten/gyrus_application.c'
};

function ifArg(name, fn, init) {
	if(Array.isArray(argv[name])) {
		if(init) init();
		argv[name].forEach(fn);
	} else if(typeof argv[name] !== "undefined") {
		if(init) init();
		fn(argv[name], -1);
	}
}

ifArg('file', function(file) {
  typewriterOptions.file = file;
});

ifArg('outfile', function(path) {
  typewriterOptions.outputFilePath = path;
});

var typewrite = require('../dist/index.js').typewrite;

typewrite(typewriterOptions.file, typewriterOptions.outputFilePath);
