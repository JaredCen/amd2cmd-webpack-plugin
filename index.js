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
    this.globalExternals = options.globalExternals;
  }

  apply(compiler) {
    const name = compiler.options.output.library;

    compiler.hooks.thisCompilation.tap('Amd2CmdPlugin', compilation => {
      const { mainTemplate, chunkTemplate } = compilation;
      const onRenderWithEntry = (source, chunk, hash) => {
        const externals = chunk.getModules().filter(m => m.external);
        const externalsDepsArray = externals.map(m =>
          typeof m.request === "object" ? m.request.amd : m.request
        );
        const externalsArguments = externals.map((m) =>
          Template.toIdentifier(`__WEBPACK_EXTERNAL_MODULE_${m.id}__`)
        );

        const localExternalsDepsArray = [];
        const globalExternalsDepsArray = externals.map((m, i) => {
          if (this.globalExternals && this.globalExternals[m.userRequest]) {
            const dep = this.globalExternals[m.userRequest];
            return dep.search(/window/) === -1 ? `window.${dep}` : dep;
          } else {
            localExternalsDepsArray.push(externalsDepsArray[i]);
            return false;
          }
        });

        const externalsRequire = externalsArguments.map((m, i) => {
          if (globalExternalsDepsArray[i]) {
            return `var ${m} = ${globalExternalsDepsArray[i]};\n`;
          } else {
            return `var ${m} = require('${externalsDepsArray[i]}');\n`;
          }
        }).join("");

        if (this.id) {
          const id = `'${this.id}/${chunk.name}'`;
          return new ConcatSource(`define(${id}, ${JSON.stringify(localExternalsDepsArray)}, function(require, cmdExports, cmdModule) {\n\n${externalsRequire}\n\ncmdModule.exports = `, source, `\n});`);
        } else {
          return new ConcatSource(`define(function(require, cmdExports, cmdModule) {\n\n${externalsRequire}\n\ncmdModule.exports = `, source, `\n});`);
        }
      };
      for (const template of [mainTemplate, chunkTemplate]) {
        template.hooks.renderWithEntry.tap(
          "Amd2CmdPlugin",
          onRenderWithEntry
        );
      }

      compilation.hooks.optimizeChunkAssets.tapAsync('Amd2CmdPlugin', (chunks, callback) => {
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

      mainTemplate.hooks.globalHashPaths.tap("Amd2CmdPlugin", paths => {
        if (name) {
          paths.push(name);
        }
        return paths;
      });
  
      mainTemplate.hooks.hash.tap("Amd2CmdPlugin", hash => {
        hash.update("exports cmd");
        hash.update(name);
      });
    });
  }
}
module.exports = Amd2CmdWebpackPlugin;