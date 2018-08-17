const verifyAuthorization = require('./tools/verifyAuthorization');
const math = require('mathjs');







module.exports = (server, jsonScoring) => {
    /**
     * @api {get} /scoringData Request scoring data.
     * @apiName GetScoringData
     * @apiGroup ScoringData
     * 
     * @apiPermission User
     * 
     * @apiUse Credentials
     * 
     * @apiSuccess {Object} result Json object representing scoring data.
     * @apiSuccess {String} error Represent potential error (Should be null on success).
     * 
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "result": {...scoringData...},
     *          "error": null
     *      }
     * 
     * @apiUse UserNotFound
     * @apiUse UserNotAuthorized
     * @apiUse InternalError
     * 
     */
    server.get('/scoringData', (req, res, next) => {
        verifyAuthorization("readScoringData", req, res, next, () => {
            res.json(200, JSON.stringify({
                'result': jsonScoring.getJsonScoring(),
                'error': null
            }));
            next();
        })
    });

    /**
     * @api {post} /scoringData Update scoring data.
     * @apiName PostScoringData
     * @apiGroup ScoringData
     * 
     * @apiPermission Admin
     * 
     * @apiUse Credentials
     * 
     * @apiParam {String} body New Json object (It must be stringify) representing scoring data. 
     * Be carefull with these data, by changing them, you can make the service unable to work !
     * 
     * 
     * @apiSuccess {String} result String that confirm that data is updated
     * @apiSuccess {String} error Represent potential error (Should be null on success).
     * 
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "result": "Scoring data is updated",
     *          "error": null
     *      }
     * 
     * @apiUse UserNotFound
     * @apiUse UserNotAuthorized
     * @apiUse InternalError
     * 
     */
    server.post('/scoringData', (req, res, next) => {
        verifyAuthorization("writeScoringData", req, res, next, () => {
            if (req.header('Content-type') !== 'application/json') {
                res.json(400, JSON.stringify({
                    'result': null,
                    'error': 'Data must be a passed in json. Please refer to the documentation.'
                }));
                next();
                return;
            }
            let newScoringData = null
            try {
                newScoringData = JSON.parse(req.body);
            } catch (error) {
                res.json(400, JSON.stringify({
                    'result': null,
                    'error': 'Data are not in good format. Please refer to the documentation.'
                }));
                next();
                return;
            }

            if (!pointsAreLastKeys(newScoringData)) {
                res.json(400, JSON.stringify({
                    'result': null,
                    'error': 'Data are not in good format. \'points\' keys should be in last position in each subobjects.'
                }));
                next();
                return;
            }

            //Update jsonScoring object (will be written in the file later)
            jsonScoring.setJsonScoring(newScoringData, (isWritten) => {
                if (!isWritten) {
                    res.json(500, JSON.stringify({
                        'result': null,
                        'error': 'Service experienced internal error, we apologize for the inconveniant. Please retry later.'
                    }));
                    next();
                    return;
                }
                res.json(200, JSON.stringify({
                    'result': 'Scoring data is updated',
                    'error': null
                }));
                next();
            });
        });
    });


    /**
     * @api {get} /scoringData/position Request scoring data of one position.
     * @apiName GetPositionScoringData
     * @apiGroup ScoringData
     * 
     * @apiPermission User
     * 
     * @apiUse Credentials
     * 
     * @apiSuccess {Object} result Json object representing scoring data.
     * @apiSuccess {String} error Represent potential error (Should be null on success).
     * 
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "result": {...scoringData...},
     *          "error": null
     *      }
     * 
     * @apiUse UserNotFound
     * @apiUse UserNotAuthorized
     * @apiUse InternalError
     * @apiUse DataNotFound
     * 
     */
    server.get('/scoringData/position', (req, res, next) => {
        verifyAuthorization("readScoringData", req, res, next, () => {
            const positionTitle = (req.query.positionTitle ? req.query.positionTitle : "");
            let positionScoringData = null;
            if (!jsonScoring.getJsonScoring().soughtJob) {
                console.log("No positions are reported in 'soughtJob' section in 'scoring.json'");
                res.json(204, JSON.stringify({
                    'result': 'No position found with the title you gave',
                    'error': null
                }));
                next();
                return;
            }
            positionScoringData = jsonScoring.getJsonScoring().soughtJob.filter((position) => {
                return (position.title === positionTitle);
            });
            if (positionScoringData.length === 0) {
                res.json(204, JSON.stringify({
                    'result': 'No position found with the title you gave',
                    'error': null
                }));
                next();
            }
            else if (positionScoringData.length === 1) {
                res.json(200, JSON.stringify({
                    'result': positionScoringData[0],
                    'error': null
                }));
                next();
            }
        });
    });


    /**
     * @api {post} /scoringData/position Add scoring data for one position
     * @apiName PostPositionScoringData
     * @apiGroup ScoringData
     * 
     * @apiPermission Admin
     * 
     * @apiUse Credentials
     * 
     * @apiSuccess {String} result String that confirm that data is inserted.
     * @apiSuccess {String} error Represent potential error (Should be null on success).
     * 
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "result": "Position Scoring data is inserted",
     *          "error": null
     *      }
     * 
     * @apiUse UserNotFound
     * @apiUse UserNotAuthorized
     * @apiUse InternalError
     */
    server.post('/scoringData/position', (req, res, next) => {
        verifyAuthorization("writeScoringData", req, res, next, () => {
            if (req.header('Content-type') !== 'application/json') {
                res.json(400, JSON.stringify({
                    'result': null,
                    'error': 'Data must be a passed in json. Please refer to the documentation.'
                }));
                next();
                return;
            }
            let newPositionScoringData = null

            try {
                newPositionScoringData = JSON.parse(req.body);
            } catch (error) {
                res.json(400, JSON.stringify({
                    'result': null,
                    'error': 'Data are not in good format. Please refer to the documentation.'
                }));
                next();
                return;
            }
            if (!pointsAreLastKeys(newPositionScoringData)) {
                res.json(400, JSON.stringify({
                    'result': null,
                    'error': 'Data are not in good format. \'points\' keys should be in last position in each subobjects.'
                }));
                next();
                return;
            }
            let allJsonScoring = jsonScoring.getJsonScoring();
            allJsonScoring.soughtJob.push(newPositionScoringData);
            jsonScoring.setJsonScoring(allJsonScoring, (isWritten) => {
                if (!isWritten) {
                    res.json(500, JSON.stringify({
                        'result': null,
                        'error': 'Service experienced internal error, we apologize for the inconveniant. Please retry later.'
                    }));
                    next();
                    return;
                }
                res.json(200, JSON.stringify({
                    'result': 'Position Scoring data is inserted',
                    'error': null
                }));
                next();
            });
        });
    });

    /**
     * @api {delete} /scoringData/position Delete scoring data of one position.
     * @apiName DeletePositionScoringData
     * @apiGroup ScoringData
     * 
     * @apiPermission Admin
     * 
     * @apiUse Credentials
     * 
     * @apiSuccess {String} result String that confirm that data is deleted.
     * @apiSuccess {String} error Represent potential error (Should be null on success).
     * 
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "result": {...scoringData...},
     *          "error": null
     *      }
     * 
     * @apiUse UserNotFound
     * @apiUse UserNotAuthorized
     * @apiUse InternalError
     * @apiUse DataNotFound
     */
    server.del('/scoringData/position', (req, res, next) => {
        verifyAuthorization('writeScoringData', req, res, next, () => {
            const positionTitle = (req.query.positionTitle ? req.query.positionTitle : "");
            if (!jsonScoring.getJsonScoring().soughtJob) {
                console.log("No positions are reported in 'soughtJob' section in 'scoring.json'");
                res.json(204, JSON.stringify({
                    'result': 'No position found with the title you gave',
                    'error': null
                }));
                next();
                return;
            }
            let scoringData = jsonScoring.getJsonScoring();
            newSoughtJobArray = scoringData.soughtJob.filter((position) => {
                return (position.title !== positionTitle);
            });
            if (scoringData.soughtJob === newSoughtJobArray) {
                res.json(204, JSON.stringify({
                    'result': 'No position found with the title you gave',
                    'error': null
                }));
                next();
                return;
            }
            scoringData.soughtJob = newSoughtJobArray;
            jsonScoring.setJsonScoring(scoringData, (isWritten) => {
                if (!isWritten) {
                    res.json(500, JSON.stringify({
                        'result': null,
                        'error': 'Service experienced internal error, we apologize for the inconveniant. Please retry later.'
                    }));
                    next();
                    return;
                }
                res.json(200, JSON.stringify({
                    'result': 'Position Scoring data is deleted',
                    'error': null
                }));
                next();
            });
        })
    })
}

/**
 * This function verify in a json object that each "points" key is the last key in object or subobject
 * It take a json object in param 
 * It returns a boolean (true is each "points" key is the last key, false otherwise)
 *  
 */
const pointsAreLastKeys = (json) => {
    const keys = Object.keys(json);
    let i = 0;
    while (i < keys.length) {
        if (keys[i] === "points" && i < keys.length - 1) {
            return false;
        }
        switch (math.typeof(json[keys[i]])) {
            case 'Object':
                if(!pointsAreLastKeys(json[keys[i]])){
                    return false;
                }
                break;
            case 'Array':
                let sameType = true;
                json[keys[i]].map((value) => {
                    if (math.typeof(value) !== 'Object') {
                        sameType = false;
                    }
                });
                if (!sameType) {
                    fillRequirements = false;
                }
                let j = 0;
                while (j < json[keys[i]].length) {
                    if(!pointsAreLastKeys(json[keys[i]][j])){
                        return false;
                    }
                    j++;
                }
                break;
        }
        i++;
    }
    return true;
}

