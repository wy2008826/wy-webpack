#!  /usr/bin/env node

const path = require('path');
const fs = require('fs');
const program = require('commander');
let cwd = process.cwd();

const Compiler = require('./compiler');
/**
 * 流程
 * 1、将命令行中的参数和webpack.config.js中的参数进行合并
 * 2、
 * 
 * 
 * 
 * 
 * **/

// 从命令行中读取并解析参数
program
  .version('0.1.0', '-v, --version')
  .option('-m, --mode [type]', 'set mode')
  .option('-c, --config [type]', '设置webpack的文件地址')
  .option('-p, --progress', 'with progress')
  .parse(process.argv);


const {
    config,
    mode
} = program;

// 读取webpack.config.js 文件的配置参数
let allConfig = require(path.resolve(cwd,config || './webpack.config.js'))

allConfig= {
  ...allConfig,
  cwd
}

/**
 *  将 命令行中的参数 和 webpack.config.js中的参数进行合并
 *  mode
 *  config 文件
 *  其它参数。。。
 *  
 * **/
if(mode && (mode === 'production' || mode === 'development')){
    allConfig.mode = mode;
}



console.log('config',allConfig);




const compiler = new Compiler(allConfig);
compiler.run();

module.exports = {

};