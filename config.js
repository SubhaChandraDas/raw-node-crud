let environment = {};

environment.local = {
    httpport: 3000,
    httpsport: 3001,
    envName: "local",
    hashingSecret: 'thisIsASecret'
}

environment.production = {
    httpport: 5000,
    httpsport: 5001,
    envName: "production",
    hashingSecret: 'stateYourSecret'
}

const passedEnvironment = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV.toLowerCase() : "";

const selectedEnvironment = typeof(environment[passedEnvironment]) === "object" ? environment[passedEnvironment] : environment.local;


module.exports = selectedEnvironment;