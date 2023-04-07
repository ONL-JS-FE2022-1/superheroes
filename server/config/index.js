const path = require('path');

module.exports = {
    STATIC_PATH: path.resolve(__dirname, '..', 'public'),
    PORT: process.env.PORT || 5000
}