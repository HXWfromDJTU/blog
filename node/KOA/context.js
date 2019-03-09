let { defineSetter, defineGetter } = require('./utils'); // 引入设置属性委托代理的工具函数

const context = {};

// 将request的url代理给 外部 ctx对象上    
defineSetter(context, 'request', 'url');

// 将 request 对象的 path 代理给 外部的 ctx 对象上       
defineSetter(context, 'request', 'path');

// 将 response 对象上的 status 与 body 两个对象的操纵权也暴露到外面 ctx 对象上       
defineGetter(context, 'response', 'body');
defineSetter(context, 'response', 'body');

defineGetter(context, 'response', 'status');
defineSetter(context, 'response', 'status');


module.exports = context;