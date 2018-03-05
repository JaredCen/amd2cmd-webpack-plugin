# AMD2CMD Webpack Plugin

此插件会把webpack打包的amd库输出为cmd库。

## Installation
Install the plugin with npm:

```shell
$ npm install amd2cmd-webpack-plugin --save-dev
```

## Usage

```javascript
var Amd2CmdWebpackPlugin = require('amd2cmd-webpack-plugin')
var webpackConfig = {
    entry: {
        // ...
    },
    externals: {
        jquery: '$',
        // ...
    },
    output: {
        // ...
        libraryTarget: 'amd'
    },
    plugins: [
        new Amd2CmdWebpackPlugin(),
        // ...
    ]
};
```

编译结果如下：

```javascript
define(function(require, cmdExports, cmdModule) {
    var __WEBPACK_EXTERNAL_MODULE_70__ = require('$');
    cmdModule.exports = /**** webpack source ****/;
});
```

## API

- id `{String}`
插件会把传入的`id`值与模块名拼接成`dependencies`参数。

```javascript
var webpackConfig = {
    // ...
    entry: {
        webpack-plugin: ''
    },
    externals: {
        jquery: '$',
        // ...
    },
    plugins: [
        new Amd2CmdWebpackPlugin({
            id: '../amd2cmd/'
        }),
        // ...
    ]
};
```

编译结果如下：

```javascript
define('../amd2cmd/webpack-plugin', ["$"], function(require, cmdExports, cmdModule) {
    // ...
});
```

- globalExternals `{Object}`
插件会把`globalExternals`中的依赖引入方式从`require`函数方式引入改为全局变量引入。

```javascript
var webpackConfig = {
    // ...
    externals: {
        jquery: '$',
        // ...
    },
    plugins: [
        new Amd2CmdWebpackPlugin({
            globalExternals: {
                jquery: '$'
            }
        }),
        // ...
    ]
};
```

编译结果如下：

```javascript
define(function(require, cmdExports, cmdModule) {
    var __WEBPACK_EXTERNAL_MODULE_70__ = window.$;
    // ...
});
```

## Configuration
为了支持js concat 和 ie (version 6-9)，`require`标识符需要被保留，[详见CMD官方说明](https://github.com/seajs/seajs/issues/426). 

你可以通过配置`UglifyJsPlugin`保留`require`标识符，然后使用CMD构建工具去生成`id`和`dependencies`。

```javascript
var Amd2CmdWebpackPlugin = require('amd2cmd-webpack-plugin')
var webpackConfig = {
    // ...
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['require']
            },
        })
    ]
};
```

## License

This project is licensed under MIT.