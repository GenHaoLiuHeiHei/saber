// 配置编译环境和线上环境之间的切换

let baseUrl = '';
let iconfontVersion = ['567566_pwc3oottzol', '1066523_v8rsbcusj5q'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `${baseUrl}/code`
const env = process.env
// console.log(env);
if (env.NODE_ENV == 'development') {
    baseUrl = env.BASE_URL; // 开发环境地址
} else if (env.NODE_ENV == 'production') {
    baseUrl = `http://m.11yaoyao.com`; //生产环境地址
} else if (env.NODE_ENV == 'test') {
    baseUrl = `http://47.108.26.7:8080`; //测试环境地址
}
export {
    baseUrl,
    iconfontUrl,
    iconfontVersion,
    codeUrl,
    env
}
