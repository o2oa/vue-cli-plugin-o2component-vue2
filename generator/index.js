module.exports = (api, option, rootOptions) => {
    const name = rootOptions.projectName;
    rootOptions.o2componentName = name.replace('x_component_', '').split('_').join('.');
        api.render('./template');
    api.extendPackage({
        'dependencies': {
            '@o2oa/component': '^1.1.0'
        },
        'scripts': {
            'o2-deploy': 'vue-cli-service build --dest ../../dest/'+name,
            'deploy': 'vue-cli-service build && vue-cli-service deploy'
        }
    });
}
