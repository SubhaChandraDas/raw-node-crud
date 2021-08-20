const helpers = {};
const crypto = require('crypto');
const config = require('../config')

helpers.hash = function(str) {
    if (typeof(str) === "string") {
        return crypto.createHmac("sha256", config.hashingSecret).update(str).digest('hex');
    }
    return false;
}

helpers.parseJsonToObject = function(obj) {
    try {
        const parsedObj = JSON.parse(obj);
        return parsedObj;
    } catch (error) {
        return {}
    }
}

module.exports = helpers;