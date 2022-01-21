import _axiosInstance from './axios';

// 遍历,生成请求函数
const trans = (apiObj) => {
    const obj = apiObj;
    Object.keys(obj).forEach((apiKey) => {
        const data = {
            ...obj[apiKey]
        }
        obj[apiKey] = (payload) => _axiosInstance({
            method: data.method,
            url: '/api' + data.url,
            ...payload
        });
    });

    return obj;
};

// -转驼峰
function toCamelCase(str) {
    const pattern = /-([a-z])/g;
    return str.replace(pattern, (all, letter) => {
        // console.log(all, letter);
        return letter.toUpperCase();
    });

}

// https://webpack.docschina.org/guides/dependency-management/#requirecontext
const apiAll = require.context('apis/', true, /-apis\.js$/);
// console.log(apiAll);
// key: 处理后的文件名, value: 文件内容中网络请求的方法名
const moduleApis = {};
// keys属性 {Function} -匹配成功模块的名字组成的数组
apiAll.keys().map((key) => {
    // 先将-去掉,然后将小写a转换成大写A,最后取到 .的下标
    const suffixIndex = toCamelCase(key.match(/.*\/(.*\..*)/)[1]).indexOf('.');
    // 截取文件名
    const name = toCamelCase(key.match(/.*\/(.*\..*)/)[1]).substring(0, suffixIndex);
    moduleApis[name] = apiAll(key).default;
    return trans(moduleApis[name]);
});

export default moduleApis;

