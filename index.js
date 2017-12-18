/*
    Author Junrey Cen <junrey@foxmail.com>
*/

"use strict";

const ConcatSource = require("webpack-sources").ConcatSource;
const RawSource = require("webpack-sources").RawSource;
const Template = require("webpack/lib/Template");

class Amd2CmdWebpackPlugin {
    constructor(options = {}) {
        this.id = options.id;
    }

    apply(compiler) {
        const name = compiler.options.output.library;

        compiler.plugin("this-compilation", (compilation) => {
            const mainTemplate = compilation.mainTemplate;

            compilation.templatesPlugin("render-with-entry", (source, chunk, hash) => {
                const externals = chunk.modules.filter((m) => m.external);
                const externalsDepsArray = externals.map((m) =>
                    typeof m.request === "object" ? m.request.amd : m.request
                );
                const externalsArguments = externals.map((m) =>
                    Template.toIdentifier(`__WEBPACK_EXTERNAL_MODULE_${m.id}__`)
                );

                const externalsRequire = externalsArguments.map((m, i) => `var ${m} = require('${externalsDepsArray[i]}');\n`).join("");

                if (this.id) {
                    const id = `'${this.id}/${chunk.name}'`;
                    return new ConcatSource(`
                    define(${id}, ${JSON.stringify(externalsDepsArray)}, function(require, cmdExports, cmdModule) {\n
                        ${externalsRequire}
                        cmdModule.exports = `, source, `
                    });
                    `);
                } else {
                    return new ConcatSource(`
                    define(function(require, cmdExports, cmdModule) {\n
                        ${externalsRequire}
                        cmdModule.exports = `, source, `
                    });
                    `);
                }
            });

            compilation.plugin("optimize-chunk-assets", (chunks, callback) => {
                chunks.forEach((chunk) => {
                    chunk.files.forEach((file) => {
                        if (/\.js$/.test(file)) {
                            const asset = compilation.assets[file];
                            const input = asset.source();

                            const source = (s => {
                                    s = s.replace(/define[\s\S]+?define\(/, 'define(');
                                    s = s.replace(/\}\);\s*\}\);;$/, '\n});');
                                    return s;
                            })(input);

                            compilation.assets[file] = new ConcatSource(new RawSource(source));
                        }
                    });
                });
                callback();
            });

            mainTemplate.plugin("global-hash-paths", (paths) => {
                if (name) paths.push(name);
                return paths;
            });
            mainTemplate.plugin("hash", (hash) => {
                hash.update("exports cmd");
                hash.update(name);
            });
        });
    }
}
module.exports = Amd2CmdWebpackPlugin;