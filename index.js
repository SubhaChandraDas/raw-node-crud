//Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const { StringDecoder } = require('string_decoder');
const config = require('./config');

// const fileOperations = require('./lib/fileOperations');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

// fileOperations.create('testDir', 'newFile', { somthing: 'not important' }, function(error) {
//     console.log('Error occurred: ', error)
// })


const certificateConf = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(certificateConf, function(req, res) {
    serverCommonFunction(req, res)
})

//Every time a request arrives, the function req, res will filled up with new data
const httpServer = http.createServer(function(req, res) {
    serverCommonFunction(req, res)
})

const serverCommonFunction = function(req, res) {
    const parsedUrl = url.parse(req.url, true);

    //trimming up pathname if any / resides
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const httpMethod = req.method;

    const decoder = new StringDecoder('utf-8');
    let buffer = "";
    req.on('data', function(data) {
        buffer += decoder.write(data);
    })

    req.on('end', function() {
        buffer += decoder.end();

        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;


        const data = {
            trimmedPath,
            method: httpMethod.toLowerCase(),
            headers: req.headers,
            payload: helpers.parseJsonToObject(buffer),
            queryStringObjec: parsedUrl.query
        }

        //route the request to the handler specified in router
        chosenHandler(data, function(statusCode, payload) {
            statusCode = typeof(statusCode) === "number" ? statusCode : 200;
            payload = typeof(payload) === "object" ? payload : {};

            let payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('payload string: ', statusCode, payloadString)

        })


        //send the response
        // res.end('Hello World\n');

        // console.log('Request received on path: ', trimmedPath)
        // console.log('Query object', parsedUrl.query)
        // console.log('Headers information', req.headers)
        // console.log('Request payload', JSON.parse(buffer))
    })
}


httpServer.listen(config.httpport, function() {
    console.log(`Server is listening on Port ${config.httpport}`)
})
httpsServer.listen(config.httpsport, function() {
    console.log(`Server is listening on Port ${config.httpsport}`)
})


//Defining the router

let router = {
    'ping': handlers.ping,
    'users': handlers.users
};