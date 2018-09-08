## 偷偷开发个babel插件
___
### 先看看大厂们的作品
[babel-plugin-component](https://github.com/ElementUI/babel-plugin-component)  Element-UI 按需引入组件
使用
```node
npm i babel-plugin-component -D
```
```js
{
  "plugins": [["component", options]]
}
```
效果
```js
import Components from 'components'
import { Button } from 'components'

      ↓ ↓ ↓ ↓ ↓ ↓
      
require('components/lib/styleLibraryName/index.css')
var button = require('components/lib/styleLibraryName/button.css')
```
[babel-plugin-import](https://github.com/ant-design/babel-plugin-import)  Ant-design 按需引入组件
使用
```node
npm install babel-plugin-import --save-dev
```
```js
{
  "plugins": [["import", options]]
}
```
效果
```js
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓
      
var _button = require('antd/lib/button');
require('antd/lib/button/style');
ReactDOM.render(<_button>xxxx</_button>);
```
___
### 开发规范
[babel-plugin官方手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)，永远是标准，以下摘抄总结部分。
（...未完）

___
### 参考文章
[babel插件开发 by 潇湘待雨](https://juejin.im/post/5b15f43fe51d4506b26e9638)