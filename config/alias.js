const path = require('path')

module.exports.alias = {
    '@constant': path.resolve(__dirname, '../frontend/constant'),
    '@components': path.resolve(__dirname, '../frontend/components'),
    '@antarctic': path.resolve(__dirname, '../frontend/antarctic'),
    '@util': path.resolve(__dirname, '../frontend/util'),
}