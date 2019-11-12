
const fs = require('fs');
const path = require('path');


const parser = require('@babel/parser');
const types= require('@babel/types');
const traverse= require('@babel/traverse').default;;
const generator= require('@babel/generator').default;

console.log(traverse,generator);

module.exports = class Compiler {
    constructor(config){

        this.config = config;

    }
    getFileSource(dir){
        const source = fs.readFileSync(dir,'utf-8');
        return source;
    }
    run(){
        const {
            entry,
            cwd
        } = this.config;

        
        let fileNames = Object.keys(entry);
        
        (fileNames||[]).map((fileName)=>{
          console.log(cwd,entry[fileName]);
          let fileSource = fs.readFileSync(path.resolve(cwd,entry[fileName]),'utf-8');
        
          const compiler = new Compiler();
          let ast = parser.parse(fileSource,{
            sourceType:'module',//只有设置了module才可以解析 es5中的模块语法
          });

          //遍历ast节点树 进行树木的改造
          traverse(ast,{
              CallExpression(node){
                  //转换require语法
                  if(node.node.callee.name==='require'){
                    node.node.callee.name='wy_require'
                    // console.log('----node----:\n\n\n',node);
                  }
                  //转换 es6模块化语法
                  if(node.node.type==='File' && node.node.program.type==='module'){

                  }
              }
          });

          

          console.log(generator(ast).code);
        })
        
    }

}