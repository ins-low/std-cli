
'use strict';

var fs = require('fs');
var ttf2woff = require('./index.js');

var input;
var options = {};

/* eslint-disable */
function transfrom(source, target, configs){
  try {
    input = fs.readFileSync(source);
  } catch (e) {
    console.error("Can't open input file (%s)", source);
    process.exit(1);
  }


  var ttf = new Uint8Array(input);
  var woff = ttf2woff(ttf, options);

  fs.writeFileSync(target, woff);
}


module.exports = (...args) => {
  const [source, target, configs] = args;
  console.log(args);
  return transfrom(source, target, configs);
};