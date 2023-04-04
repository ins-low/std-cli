const inquirer = require('inquirer');
inquirer
    .prompt([{
        type: 'list',
        name: 'index',
        message: '请选择你想要操作的任务？',
        choices: [{
                name: '退出',
                value: 'quit'
            },
            {
                name: '已完成',
                value: 'markAsDone'
            },
            {
                name: '未完成',
                value: 'markAsUndone'
            },
            {
                name: '改标题',
                value: 'updateTitle'
            },
            {
                name: '删除',
                value: 'remove'
            }
        ]
    }, ])
    .then((answer) => {
        //选中后会执行then操作，answer是选中的项目

    });