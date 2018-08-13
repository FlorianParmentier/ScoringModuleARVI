const restify = require('restify');
const chokidar = require('chokidar');
const accessJsonFile = require('./tools/accessJsonFile');

let jsonScoring = null;

/**
 * jsonScoring getter
 */
getJsonScoring = () => jsonScoring;

/**
 * jsonScorring setter
 */
setJsonScoring = (data, callback) => { 
    jsonScoring = data;
    accessJsonFile.write('scoringData/scoring.json', jsonScoring, (isWritten) => {
        return callback(isWritten);
    }) 
};


//Create a server
const server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({
    requestBodyOnGet: true
}));

//Initialise scoring data from external file
accessJsonFile.read("scoringData/scoring.json", (jsonData) => {
    jsonScoring = jsonData;
});


/*
Import routes for scoring data
*/
require('./scoringDataRoutes.js')(server, { getJsonScoring, setJsonScoring });
/*
Import routes for scoring profile
*/
require('./scoringRoutes.js')(server, { getJsonScoring, setJsonScoring });


//Launch server 
server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});



/*
The server listen every changes on the file with scoring and update the related Json object
Be aware with stabitityThreshold param, if the server take more time to write the file, this value can need to be updated
*/
chokidar.watch('scoringData/scoring.json', { awaitWriteFinish: { stabilityThreshold: 10 } }).on('change', () => {
    accessJsonFile.read('scoringData/scoring.json', (jsonData) => {
        jsonScoring = jsonData;
    });
})





