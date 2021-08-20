//defining handlers
let handlers = {}

handlers.ping = function(error, callBack) {
    callBack(200)
}

//Not found Handler
handlers.notFound = function(data, callBack) {
    callBack(404)
}

module.exports = handlers;