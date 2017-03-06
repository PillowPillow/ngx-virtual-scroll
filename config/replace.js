// const replace = require("replace");
const fs = require('fs-extra');

/**
 * ngc output pathing is totally wrong
 */
fs.copySync('./release/build', './release');
fs.removeSync('./release/node_modules');
fs.removeSync('./release/build');
