const fs = require('fs');
const path = require('path');

let lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function(dir, fileName, data, callBack) {

    fs.open(lib.baseDir + dir + '/' + fileName + '.json', 'wx', function(err, fileDescriptor) {
        if (!err && fileDescriptor) {

            const jsonData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, jsonData, function(err) {
                if (!err) {
                    fs.close(fileDescriptor, function(err) {
                        if (!err) {
                            callBack(false)
                        } else {
                            callBack('Error on closing file')
                        }
                    })
                } else {
                    callBack('Some error occured during writing to the file');
                }
            })

        } else {
            callBack('Could not create new File, may already exist')
        }
    })

}

lib.read = function(dir, fileName, callBack) {
    fs.readFile(lib.baseDir + dir + '/' + fileName + '.json', 'utf8', function(err, data) {
        callBack(err, data)
    })
}

lib.update = function(dir, fileName, data, callBack) {

    fs.open(lib.baseDir + dir + '/' + fileName + '.json', 'r+', function(err, fileDescriptor) {
        if (!err && fileDescriptor) {

            const jsonData = JSON.stringify(data);
            fs.truncate(fileDescriptor, function(err) {
                if (!err) {
                    fs.writeFile(fileDescriptor, jsonData, function(err) {
                        if (!err) {
                            fs.close(fileDescriptor, function(err) {
                                if (!err) {
                                    callBack(false)
                                } else {
                                    callBack('Error on closing file')
                                }
                            })
                        } else {
                            callBack('Some error occured during writing to the file');
                        }
                    })
                } else {
                    callBack('Error on truncating file');
                }
            })

        } else {
            callBack('Could not create new File, may already exist')
        }
    })

}

lib.delete = function(dir, fileName, callBack) {
    fs.unlink(lib.baseDir + dir + '/' + fileName + '.json', function(err) {
        if (!err) {
            callBack(false) //it means no error occurred
        } else {
            callBack('Error occurred during the file delete')
        }
    })
}



module.exports = lib;