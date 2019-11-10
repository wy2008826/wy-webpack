#!  /usr/bin/env node

// 命令行交互


const Inquirer = require('inquirer');

console.log('__dirname:',__dirname);


Inquirer.prompt([{
    type:'checkbox',
    name:'isDisabled',
    message:'请选择要生成的页面类型：',
    choices:['列表页','表单页']
}]).then((answers)=>{
    console.log("\n\r",JSON.stringify(answers,null,'  '));
});

