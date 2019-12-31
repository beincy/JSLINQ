import axios from 'axios';
import envData from './env';
import zbyUrl from './zbyurl';

/** 
 * axios异步封装
 * 1.环境变量
 * 2.加密
 * 3.登录
 */
axios.interceptors.request.use(config => {
    let req = {...config };

    if (!/^http/i.test(req.url)) {
        req.url = envData.urlPublic + req.url;
    }
    if (req.method.toLowerCase() == 'get') {
        req.url = zbyUrl(req.url, req.params, false, true);
    } else {
        req.url = zbyUrl(req.url, req.data);
    }

    return req;

}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.reject(error)
})

export default axios;