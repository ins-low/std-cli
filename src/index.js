module.exports = (...args) => {
  const loadRemotePreset = require('./loadRemotePreset');
  const [isGitHub, urlObj] = args;
  let url = 'direct:'+isGitHub
  return loadRemotePreset(url,true);
}


