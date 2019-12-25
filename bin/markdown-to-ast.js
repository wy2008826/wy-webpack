#!  /usr/bin/env node

const fs = require('fs');
const path = require('path');
const parse = require('markdown-to-ast').parse;

const markdown = fs.readFileSync(path.resolve(__dirname,'../README.md'),'utf-8');

const ast = parse(markdown);
console.log(markdown,JSON.stringify(ast,null,2));
