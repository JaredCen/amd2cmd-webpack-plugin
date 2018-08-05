var path = require('path')
var webpack = require('webpack')
var Amd2CmdWebpackPlugin = require('../index')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var output = {
    mode: 'development',
    entry: {
        example: path.join(__dirname, '../example/example.js')
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '../example'),
        libraryTarget: 'amd'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [path.join(__dirname, '../example')]
        }]
    },
    externals: {
        lodash: '_',
        jquery: '$',
    },
    plugins: [
        new Amd2CmdWebpackPlugin({
            globalExternals: {
                lodash: '_'
            }
        }),
    ]
};

var outputWithId = {
    mode: 'development',
    entry: {
        example: path.join(__dirname, '../example/example.js')
    },
    output: {
        filename: 'bundle.withId.js',
        path: path.join(__dirname, '../example'),
        libraryTarget: 'amd'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [path.join(__dirname, '../example')]
        }]
    },
    externals: {
        lodash: '_',
        jquery: '$',
    },
    plugins: [
        new Amd2CmdWebpackPlugin({
            id: './example'
        }),
    ]
};

var minOutput = {
    mode: 'production',
    entry: {
        example: path.join(__dirname, '../example/example.js')
    },
    output: {
        filename: 'bundle.min.js',
        path: path.join(__dirname, '../example'),
        libraryTarget: 'amd'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [path.join(__dirname, '../example')]
        }]
    },
    externals: {
        lodash: '_',
        jquery: '$',
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    mangle: {
                        reserved: ['require'],
                    }
                }
            })
        ]
    },
    plugins: [
        new Amd2CmdWebpackPlugin({
            globalExternals: {
                lodash: '_'
            }
        })
    ]
};

module.exports = [output, outputWithId, minOutput];