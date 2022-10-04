export const registerRules=function (){
    let validatePass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'))
            // password 是表单上绑定的字段
        } else if (value !== this.registerForm.password) {
            callback(new Error('两次输入密码不一致!'))
        } else {
            callback()
        }
    }
    const rules={
        username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { pattern: /^[a-zA-Z]+$/, message: '用户名只能包含字母' }

        ],
        email:[
            { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确格式的邮箱' }
        ],
        password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,18}$/, message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 18位。' }
        ],
        password2:[
            { required: true, validator: validatePass, trigger: 'blur' }
        ]
    }
    return rules
}

export const  loginRules=function (){
    const rules={
        username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
        ]
    }
    return rules
}
