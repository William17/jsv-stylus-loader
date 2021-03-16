# jsv-stylus-loader [![Build Status](https://travis-ci.org/William17/jsv-stylus-loader.png?branch=main)](http://travis-ci.org/William17/jsv-stylus-loader)    

一个用于把 styl 文件转成视九浏览器 jsview 样式的 webpack loader。  

例如  
```stylus
.block_item
  font-size 30px
  height 100px
  width 100px
  background-color #000000
```

转成  
```js
import { JsvTextStyleClass } from "jsview-utils/JsViewReactTools/JsvStyleClass";
function createStyleClass(styleObj) {
  return new JsvTextStyleClass(styleObj).getName() 
}
export const block_item = createStyleClass({"fontSize":"30px","height":"100px","width":"100px","backgroundColor":"#000"})
```

## 使用  
```js
npm install jsv-stylus-loader --save  
```

在 webpack 配置里添加 loader  
```js
  {
    test: /\.jsv\.styl$/,
    loader: 'jsv-stylus-loader',
  }
```

在 webpack 里配置 jsview-utils 的 alias，例如  
```js
alias: {
  // ...
  'jsview-utils': path.resolve(`${paths.appSrc}/jsview-utils`),
}
```