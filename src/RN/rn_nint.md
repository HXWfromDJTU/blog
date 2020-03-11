# RN 爬坑

## 项目初始化
> ① 版本不匹配
> ② 需要 `clear watchman`等操作

### 解决
* 经常因为`rn`、`react`、`babel`等工具版本的不匹配，所以导致安卓端报错。
* 若是
使用 `react-native init projectName --verbose --version 0.55.0`

## 调试

### 
> adb server version (31) doesn't match this client (40); killing...
>could not read ok from ADB Server
> * failed to start daemon
> error: cannot connect to daemon

解决：
 使用任务管理器，关闭掉各种手机助手占用的手机连接。

