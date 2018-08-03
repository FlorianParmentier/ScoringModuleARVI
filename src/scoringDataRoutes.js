const verifyAuthorization = require('./tools/verifyAuthorization');


    /**
     * @apiDefine Credentials
     * @apiHeader {String} Authorization User credentials (base64 encoded)
     * 
     * @apiHeaderExample {String} Authorization: 
     *      "Basic *login:password*" (Credentials between stars (*) must be base64 encoded) 
     */

    /**
     * @apiDefine UserNotFoundError
     * 
     * @apiError UserNotFound The credentials of the user was not found.
     * 
     * @apiErrorExample Error-Response:
     *      HTTP/1.1 401 Unauthorized
     *      {
     *          "result": null,
     *          "error": "User not found, please verify your credentials."
     *      }
     */

    /**
     * @apiDefine UserNotAuthorized
     * 
     * @apiError UserNotAuthorized The user has no right to execute this action
     * 
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 403 Forbidden
     *     {
     *         "result": null,
     *         "error": "User is not allowed to continue this action, please contact administrator to get more rights."
     *     }
     */

    /**
     * @apiDefine InternalError
     * 
     * @apiError InternalError Service experienced internal error
     * 
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *         "result": null,
     *         "error": "Service experienced internal error, we apologize for the inconveniant. Please retry later."
     *     }
     */




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
     * @apiUse UserNotFoundError
     * @apiUse UserNotAuthorized
     * @apiUse InternalError
     * 
     */
    server.get('/scoringData', (req, res, next) => {
        verifyAuthorization("readScoringData", req, res, next, () => {
            res.header('Content-type', 'application/json');
            res.send(200, JSON.stringify({
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
     *          "result": "Scoring data has been updated",
     *          "error": null
     *      }
     * 
     * @apiUse UserNotFoundError
     * @apiUse UserNotAuthorized
     * @apiUse InternalError
     * 
     */
    server.post('/scoringData', (req, res, next) => {
        verifyAuthorization("changeScoringData", req, res, next, () => {
            let payload = null;
            let error = false;
            let newScoringData = null

            try {
                newScoringData = JSON.parse(req.body);
            } catch (error) {
                res.header('Content-type', 'application/json');
                res.send(400, {
                    'result': null,
                    'error': 'Data are not in good format. Please refer to the documentation (parse).'
                });
                next();
                return;
            }

            //Update jsonScoring object (will be written in the file later)
            jsonScoring.setJsonScoring(newScoringData, (isWritten) => {
                if (!isWritten) {
                    res.header('Content-type', 'application/json');
                    res.send(500, {
                        'result': null,
                        'error': 'Service experienced internal error, we apologize for the inconveniant. Please retry later.'
                    });
                    next();
                    return;
                }
                res.header('Content-type', 'application/json');
                res.send(200, {
                    'result': 'Scoring data has been updated',
                    'error': null
                });
                next();
            })
        })
    });


    //TO DO: Méthode pour récupérer les donnée's de scoring d'un seul poste
    /*server.get('/scoringData/position', (req, res, next) => {
        verifyAuthorization(req, res, next, () => {
            const positionTitle = req.query.positionTitle;
        })
    });*/
}

