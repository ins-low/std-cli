module.exports = (...args) => {
    const loadRemotePreset = require('./loadRemotePreset');
    const [isGitHub, urlObj] = args;
    let url = 'direct:' + isGitHub
    console.log(url);
    return loadRemotePreset(url, true);
}