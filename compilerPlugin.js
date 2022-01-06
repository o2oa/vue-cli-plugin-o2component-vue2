const UglifyJS = require("uglify-js");
const path = require('path');
const pkg = require(path.resolve(process.cwd(), './package.json'));
const componentPath = pkg.name;
//const componentPath = "x_component_"+pkg.name.replace(/\./g, '_');
const componentName = componentPath.replace('x_component_', '').split('_').join('.');

function compilerO2ComponentPlugin(options) {}

function includeMain(fileList, filter, extname){
    let list = fileList.filter((v)=>{
        return v.startsWith(filter) && path.extname(v)===extname;
    });
    if (list && list.length){
        list = list.map((css)=>{
            return `../${componentPath}/` + css;
        });
        return '"'+list.join('", "')+'"';
    }
    return '';
}
compilerO2ComponentPlugin.prototype.apply = function(compiler) {
    compiler.plugin('emit', function(compilation, callback) {
        const fileList = Object.keys(compilation.assets);

        let mainFileContent = `o2.component("${componentName}", {\n`;

        const css = includeMain(fileList, '$Main/css', '.css');
        if (css) mainFileContent += `    css: [${css}],\n`;

        const js = includeMain(fileList, '$Main/js', '.js');
        if (js) mainFileContent += `    js: [${js}],\n`;

        mainFileContent += `});`;

        compilation.assets['Main.js'] = {
            source: ()=>{ return mainFileContent},
            size: ()=>{ return mainFileContent.length}
        };
        const miniMainFileContent = UglifyJS.minify(mainFileContent).code;
        compilation.assets['Main.min.js'] = {
            source: ()=>{ return miniMainFileContent},
            size: ()=>{ return miniMainFileContent.length}
        };

        let lpList = fileList.filter((v)=>{
            return v.startsWith('lp/') && path.extname(v)===".js";
        });
        if (lpList && lpList.length){
            lpList.forEach((lp)=>{
                let str = String(compilation.assets[lp].source());
                str = UglifyJS.minify(str).code;
                let name = path.basename(lp, '.js')+'.min.js';
                name = path.dirname(lp)+'/'+name;

                compilation.assets[name] = {
                    source: ()=>{ return str},
                    size: ()=>{ return str.length}
                };
            })
        }

        callback();
    });
};
module.exports = compilerO2ComponentPlugin;
