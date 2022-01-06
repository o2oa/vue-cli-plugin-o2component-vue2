module.exports = () => {
    return [
        {
            type: 'input',
            name: 'o2serverHost',
            message: 'Input o2 server hosts',
            default: ''
        },
        {
            type: 'input',
            name: 'o2serverCenterPort',
            message: 'Input o2 center server port',
            default: '20030'
        },
        {
            type: 'input',
            name: 'o2serverWebPort',
            message: 'Input o2 web server port',
            default: '80'
        },
        {
            type: 'confirm',
            name: 'isHttps',
            message: 'Is o2 server Use https',
            default: false
        }
    ];
}