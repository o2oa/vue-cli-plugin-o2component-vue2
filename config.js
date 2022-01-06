const path = require('path');
const axios = require('axios');
const fs = require('fs/promises');
const componentPlugin = require('./compilerPlugin');

const p = path.resolve(process.cwd(), './o2.config.js');
const config = require(p);
const server = config.server;
const pkg = require(path.resolve(process.cwd(), './package.json'));
const componentPath = pkg.name;
//const componentName = componentPath.replace('x_component_', '').split('_').join('.');

const host = `${(server.https) ? 'https' : 'http'}://${server.host}/${(!server.httpPort || server.httpPort==='80') ? '' : server.httpPort}`;
const proxy = {};
(config.components || []).concat(['o2_core', 'o2_lib', 'x_desktop', 'x_component_']).forEach((path)=>{
    proxy['^/'+path] = {target: host}
});
proxy['^/x_component_'].bypass = function(req, res, proxyOptions) {
    if (req.url.startsWith('/'+componentPath+'/')) return false;
}

let before = function(app){
    app.get('/x_desktop/res/config/config.json', function(req, res) {
        const configUrl = new URL(req.url, host);
        axios.get(configUrl.toString()).then((json)=>{
            let o2Config = json.data;
            o2Config.sessionStorageEnable = true;
            o2Config.applicationServer = {
                "host": (config.appServer && config.appServer.host) ? config.appServer.host : server.host
            };
            o2Config.center = [{
                "port": server.port,
                "host": server.host
            }];
            o2Config.proxyApplicationEnable = false;
            o2Config.proxyCenterEnable = false;
            res.json(o2Config);
        }).catch(()=>{
            res.end();
        });
    });
    app.get(`/${componentPath}/lp/*min.*`, function(req, res) {
        let toUrl =  path.basename(req._parsedUrl.pathname).replace(/min\./, '')
        toUrl = path.resolve(process.cwd(), 'public', './lp/'+toUrl);
        fs.readFile(toUrl).then((data)=>{
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
            res.send(data);
        }, ()=>{
            res.send('');
        });
    });
}

module.exports = {
    publicPath:  process.env.NODE_ENV === 'production' ? "../"+componentPath+"/" : "/"+componentPath+"/",
    outputDir: "./dist/"+componentPath,
    assetsDir: "$Main",
    devServer: {
        before: before,
        proxy: proxy,
        open: true
    },
    configureWebpack: {
        plugins: [
            new componentPlugin()
        ]
    }
}
