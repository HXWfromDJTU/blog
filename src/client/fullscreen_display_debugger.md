## 全面屏的适配以及调试

### JS 方法
```ts
/**
 * 判断当前是否全面屏
 */
function isFullScreenDisplay () {
  let result = false
  const rate = window.screen.height / window.screen.width
  const limit =  window.screen.height === window.screen.availHeight ? 1.8 : 1.65 // 临界判断值

  if (rate > limit) {
    result = true
  }
  return result
}
```