const fs = require('fs');
const path = require('path');
/*
This function read the json file whose the path is in params and return the callback function with "data" and "err" as params.
*/
 exports.read = (filePath, callback) => {
    if (path.extname(filePath) !== '.json') {
        console.error('This file is not json file.');
        return;
    }
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('There was an error reading the file: ', err);
            return callback(null, err);
        }
        try {
            return callback(JSON.parse(data), err);
        } catch (err) {
            console.error("Json parsing error: ", err);
            return callback(null, err);
        }
    });
}

/*
This function write json data in a file whose the path is passed in params.
Return the callback function with result and error as param (result is false if there is an error, else it is true)
*/
exports.write = (filePath, data, callback) => {
    if (path.extname(filePath) !== '.json') {
        console.error('This file is not json file.');
        return;
    }
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.log('There was an error writing the file: ', err);
            return callback(false, err);
        }
        return callback(true, err)
    })
}