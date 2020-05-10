# 项目生产环境打包 以及 发布

## 项目生产环境打包

## 项目发布


## node项目发布常见错误
#### Permission denied `未解决`
> 输入：npm start
>报错：sh: /xxxx/xxxx/node_modules/.bin/cross-env: Permission denied
* 环境：Linux
* 建议方案：
     ① 删除项目下的 `node_modules`目录，重新`npm isntall`
[参考文章1](https://github.com/pro-react/react-app-boilerplate/issues/5)


> [egg-core] load file: /xxx/xxx/app/controller/auditLog.js, error: Cannot find module './expat'
解决方案：ejsexcel模块包出错

