import request from '@/utils/request'

// 登录方法
export function login(data) {
    return request({
        url: 'index/index/login',
        method: 'post',
        data
    })
}

// 注册方法
export function register(data) {
    return request({
        url: 'index/index/register',
        method: 'post',
        data
    })
}
