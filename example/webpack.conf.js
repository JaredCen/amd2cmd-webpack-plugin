var path = require('path')
var webpack = require('webpack')
var Amd2CmdWebpackPlugin = require('../index')

var output = {
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
    plugins: [
        new Amd2CmdWebpackPlugin({
            globalExternals: {
                lodash: '_'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
              except: ['require']
            }
        }),
    ]
};

module.exports = [output, outputWithId, minOutput];