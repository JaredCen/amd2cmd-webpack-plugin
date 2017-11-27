# AMD2CMD Webpack Plugin

This is a [webpack](http://webpack.github.io/) plugin that transform AMD module into CMD module when the library is exposed as an AMD module. Because webpack can not support output library as an CMD module, so this plugin is useful when your library is supposed to run within CMD module loader like seajs.

### Installation
Install the plugin with npm:
```shell
$ npm install amd2cmd-webpack-plugin --save-dev
```

### Usage
```javascript
var Amd2CmdWebpackPlugin = require('amd2cmd-webpack-plugin')
var webpackConfig = {
    entry: {
        // ...
    },
    externals: {
        'jquery': '$',
        // ...
    },
    output: {
        // ...
        libraryTarget: 'amd'
    },
    plugins: [
        new HtmlWebpackPlugin(),
        // ...
    ]
};
```

This will make the library exposed as an CMD module:
```javascript
define(function(require, cmdExports, cmdModule) {
    var __WEBPACK_EXTERNAL_MODULE_70__ = require('$');
    cmdModule.exports = /**** webpack source ****/;
});
```

### Configuration
In order to support js concat and ie (version 6-9), `require` function within CMD module is supposed to some typographic conventions, [CMD details](https://github.com/seajs/seajs/issues/426). 

You can do this with `UglifyJsPlugin` to reserve `require` identifiers, then use CMD build tools to generate `id` and `dependencies`.
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

You can also pass `id` configuration options to add `id` property within CMD module, and the plugin will generate `dependencies` autoly.
```javascript
var webpackConfig = {
    // ...
    entry: {
        'webpack-plugin': ''
    },
    externals: {
        'jquery': '$',
        // ...
    },
    plugins: [
        new HtmlWebpackPlugin({
            id: '../amd2cmd/'
        }),
        // ...
    ]
};
```
It works:
```javascript
define('../amd2cmd/webpack-plugin', ["$"], function(require, cmdExports, cmdModule) {
    // ...
});
```

### License

This project is licensed under [MIT](https://github.com/jantimon/html-webpack-plugin/blob/master/LICENSE).