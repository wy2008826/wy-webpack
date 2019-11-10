#!  /usr/bin/env node

// 命令行交互

const program = require('commander');
const Inquirer = require('inquirer');

console.log('__dirname:',__dirname,process.argv);


// 命令行参数传递

program
  .version('0.1.0')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);


//   console.log(program);

// 收集用户交互输入

/**
 * @param type:
 * input ; 用户自行输入
 * confirm：用户确认 yes／no
 * list：单选
 * rawlist：给出选项，用户输入选择的索引
 * expand： 单选  但是职让用户选择语义化的内容，相当于选择alias，
 * checkbox：多选,
 * password：密码
 * editor:开启vim 可以自行编辑大段内容；
 * 
 * **/


Inquirer.prompt([
    {
        type:'input',//用户输入 string
        name:'name',
        message:'请输入姓名：',
        validate:(val)=>{ // 校验用户输入 不合格的话 需要重新输入
            return new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve(val > 10)
                },3000)
            })

            // return val > 10
        },
        filter:(val)=>{//过滤和处理输入内容 可以通过返回promise
            return val;
        },
        when:(prevValue)=>{ // 决定当前选项是否需要让用户处理 相当于 if 判断
            console.log('when prevValue:',prevValue);
            return true;
        },
        // pageSize : 1,// 显示几个选项  当 type 为list rawList expand checkbox 的时候
        // prefix:"api" ,// message 前缀
        // suffix:'tail',// message后缀
    },
    {
        type:'confirm',//  boolean  二选一
        name:'isDisabled',
        message:'是否禁用：',
        when:(prevValue)=>{ // 决定当前选项是否需要让用户处理 相当于 if 判断
            console.log('when prevValue:',prevValue);
            return true;
        },
    },
    {
        type:'checkbox',// 多选
        name:'interests',
        message:'爱好：',
        choices:(hasGet)=>{ // 
            console.log("计算中...");
            return new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve(hasGet.isDisabled ? ['篮球','电影','读书']:[1,2,3])
                },3000)
            })
        }
    },
    {
        type:'expand',
        name:'tast',
        message:'请选择口味',
        // default:'y',
        choices:[
            {
                key: 'y',
                name: '中辣',
                value: 'middle'
            },
            {
                key: 'a',
                name: '微辣',
                value: 'little'
            }
        ]
    },
    {
        type:'editor',
        name:'myown',
        message:'自行输入',
    }
]).then((answers)=>{
    console.log(JSON.stringify(answers,null,'  '));
});

