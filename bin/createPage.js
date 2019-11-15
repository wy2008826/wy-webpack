#!  /usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os')
const Inquirer = require('inquirer');
const ejs = require('ejs');
const cwd =process.cwd();

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
        name:'modelName',
        message:'请输入model名称(大小写字母组成，大写字母开头，长度不低于3)：',
        validate:(val)=>{ // 校验用户输入 不合格的话 需要重新输入
            return new Promise((resolve,reject)=>{
                let nameReg = /^[A-Z][A-Za-z]+$/g;

                //校验系统中是否已经有相同的model
                const hasModels = [];//系统中已经存在的model

                function myReadfileSync(MyUrl) {
                    const files= fs.readdirSync(MyUrl);
                    files.forEach(file => {
                        //拼接获取绝对路径，fs.stat(绝对路径,回调函数)
                        let fPath = path.join(MyUrl, file);
                        const stat = fs.statSync(fPath)
                        // console.log(fPath);
                        if (stat.isDirectory() === true){
                            myReadfileSync(fPath)
                        }else{
                            const source = fs.readFileSync(fPath,'utf-8');
                            const nameSpaceReg1= /namespace\s*\=\s*[\'\"]([a-zA-Z0-9]+)[\'\"][\s\n]*\;?/g;
                            const nameSpaceReg2= /namespace\s*\:\s*[\'\"]([a-zA-Z0-9]+)[\'\"][\s\n]*\,/g;

                            [nameSpaceReg1,nameSpaceReg2].map((reg)=>{
                                if(source.match(reg)){
                                    source.replace(reg,function (all,modelName,...rest) {
                                        // console.log('modelName1:',modelName);
                                        hasModels.push(modelName);
                                    })
                                }
                            })
                        }
                    })
                }

                myReadfileSync(path.resolve(cwd,'./src/models'));
                if(!nameReg.test(val)){
                    console.log(' 格式不正确');
                    resolve(false);
                }
                if( hasModels.indexOf(val)>-1){
                    console.log(' 名称已存在');
                    resolve(false);
                }
                resolve(true)
            })
        },
    },
    {
        type:'confirm',//  boolean  二选一
        name:'simple',
        message:'是否开启简单模式（简单模式:不需要回调函数自行封装子组件）',
        // when:(prevValue)=>{ // 决定当前选项是否需要让用户处理 相当于 if 判断
        //     console.log('when prevValue:',prevValue);
        //     return true;
        // },
    },
    // {
    //     type:'checkbox',// 多选
    //     name:'interests',
    //     message:'爱好：',
    //     choices:(hasGet)=>{ //
    //         console.log("计算中...");
    //         return new Promise((resolve)=>{
    //             setTimeout(()=>{
    //                 resolve(hasGet.isDisabled ? ['篮球','电影','读书']:[1,2,3])
    //             },3000)
    //         })
    //     }
    // },

    {
        type:'expand',
        name:'type',
        message:'请选择你要创建的页面类型',
        default:'l',
        choices:[
            {
                key: 'l',
                name: '列表页',
                value: 'list'
            },
            {
                key: 'm',
                name: '多Tab列表页',
                value: 'multi-list'
            }
        ]
    },
    // {
    //     type:'checkbox',// 多选
    //     name:'interests',
    //     message:'爱好：',
    //     choices:(hasGet)=>{ //
    //         console.log("计算中...");
    //         return new Promise((resolve)=>{
    //             setTimeout(()=>{
    //                 resolve(hasGet.isDisabled ? ['篮球','电影','读书']:[1,2,3])
    //             },3000)
    //         })
    //     }
    // },

    // {
    //     type:'confirm',//  boolean  二选一
    //     name:'isDisabled',
    //     message:'是否禁用：',
    //     when:(prevValue)=>{ // 决定当前选项是否需要让用户处理 相当于 if 判断
    //         console.log('when prevValue:',prevValue);
    //         return true;
    //     },
    // },
    {
        type:'editor',
        name:'comments',
        message:'请输入页面注释',
    }
]).then((_answers)=>{

    const answers = {
        user:{
            time:getNow(),
            hostname:os.hostname()
        },
        ..._answers
    }
    console.log('answers:',answers);

    //页面
    const pageTtemplate = fs.readFileSync(path.resolve(cwd,'./src/createPage/EjsTmp/PageTemplate.ejs'),'utf-8');
    let pageResult = ejs.render(pageTtemplate, answers);
    fs.writeFileSync(path.resolve(cwd,`./src/routes/_template/template.js`),pageResult,'utf-8')

    //model
    const modelTtemplate = fs.readFileSync(path.resolve(cwd,'./src/createPage/EjsTmp/PageListModel.ejs'),'utf-8')
    let modelResult = ejs.render(modelTtemplate, answers);
    fs.writeFileSync(path.resolve(cwd,`./src/models/_template/template.js`),modelResult,'utf-8')


    console.log(`\n\n\n,model 和页面已经生成 \n,请将页面和model放在适当的路径下m,\n根据model配置，在config.js中添加接口配置，\n,配置router`);
});



function getNow() {
    const d= new Date();
    const year= d.getFullYear();
    const month = d.getMonth();
    const date= d.getDate();
    const hour = d.getHours()
    const minutes = d.getMinutes()
    const s = d.getSeconds();
    const full = _=>_<10?'0'+_:_;

    return `${year}-${month}-${date} ${full(hour)}:${full(minutes)}:${full(s)}`
}
