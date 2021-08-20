//defining handlers
let handlers = {};

//dependencies
const fileOperations = require('./fileOperations');
const helpers = require('./helpers');

//ping handler
handlers.ping = function(error, callBack) {
    callBack(200)
}

//user handler
handlers.users = function(data, callBack) {
    const accepatbleMethods = ['post', 'get', 'put', 'delete'];
    if (accepatbleMethods.includes(data.method)) {
        handlers._users[data.method](data, callBack)
    } else {
        callBack(405)
    }
}

//user container - user handler sub methods

handlers._users = {};

//User Post
// Required Data: firstName, lastName, phone, password, isActive
handlers._users.post = function(data, callBack) {

    let firstName = typeof(data.payload.firstName) === "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) === "string" && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof(data.payload.phone) === "string" && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let isActive = typeof(data.payload.isActive) === "boolean" && data.payload.isActive;
    if (firstName && lastName && phone && password && isActive) {
        fileOperations.read('users', phone, function(error, data) {
            if (error) { //file with phone number not exist, create a file then
                let hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    let userObject = {
                        firstName,
                        lastName,
                        phone,
                        hashedPassword,
                        isActive
                    }
                    fileOperations.create('users', phone, userObject, function(error) {
                        if (!error) {
                            callBack(200)
                        } else {
                            console.log(error);
                            callBack(500, { "Error": "Could not create the new User!" })
                        }
                    })
                } else {
                    callBack(500, { "Error": "unable to create the hash" })
                }
            }
        })
    } else {
        callBack(400, { "Error": "Missing required parameter" })
    }
}
handlers._users.put = function(data, callBack) {

}
handlers._users.get = function(data, callBack) {

}
handlers._users.delete = function(data, callBack) {

}

//Not found Handler
handlers.notFound = function(data, callBack) {
    callBack(404)
}

module.exports = handlers;