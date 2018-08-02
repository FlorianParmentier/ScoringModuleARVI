const verifyAuthorization = require('./tools/verifyAuthorization');

module.exports = (server, jsonScoring) => {
    //Get existing scoring data
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

    //Add or update scoring data(entire file)
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
                        'error': 'We experienced internal error, we apologize for the inconveniant. Please retry later.'
                    });
                    next();
                    return;
                }
                res.header('Content-type', 'application/json');
                res.send(200, {
                    'result': "Scoring data has been updated",
                    'error': null
                });
                next();
            })

            /*checkPayload(newScoringData, ["mailAddress", "name", "photo", "phoneNumber", "lastJob", "soughtJob", "title"], true, res, next, (isWellFormated) => {
                if (isWellFormated) {
                    
                }
            })*/
        })
    });


    //TO DO: Méthode pour récupérer les donnée's de scoring d'un seul poste
    /*server.get('/scoringData/position', (req, res, next) => {
        verifyAuthorization(req, res, next, () => {
            const positionTitle = req.query.positionTitle;
        })
    });*/
}

