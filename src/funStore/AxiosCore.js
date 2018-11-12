import axios from 'axios';
import {createHashHistory} from 'history';
import {API_PATH} from '../constants/OriginName'
const instance = axios.create({
    //当创建实例的时候配置默认配置
    // baseURL: 'http://ad.dev.gemii.cc:58080',
    baseURL: API_PATH,
    withCredentials: true,
    // 'Content-Type': 'application/json', //设置跨域头部
    // "Authorization": 'Token ' + 'bcakdks'
});

//添加请求拦截器  http request 拦截器
instance.interceptors.request.use(function(config){
        //在发送请求之前做某事，比如加一个loading

        return config;
    },function(error){
        //请求错误时做些事
        return Promise.reject(error);
});

//添加一个响应拦截器 http response 拦截器
instance.interceptors.response.use(function (response) {
    // 1.成功
    if (response.data.resultCode === '100') {
        return response.data;
    }

    // 2.session过期
    if (response.data.resultCode === '112') {
        createHashHistory().push('/login');

        // 定义一个messagecode在后面会用到
        return  Promise.reject({
            messageCode: 'timeout'
        })
    }

    // 3.其他失败，比如校验不通过等
    return Promise.reject(response.data);
}, function () {
    // 4.系统错误，比如500、404等
    return Promise.reject({
        messageCode: 'sysError'
    });
});

export default instance;