const verifyAuthorization = require('./tools/verifyAuthorization');
const searchJsonObjectKey = require('./tools/searchJsonObjectKey');
const math = require('mathjs');

module.exports = (server, jsonScoring) => {

    /**
     * @api {post} /profileScoring Score a profile
     * @apiName ScoreProfile
     * @apiGroup Scoring
     * 
     * @apiPermission User
     * 
     * @apiUse Credentials
     * 
     * @apiSuccess {Object} result Object which contain the obtained score and the max score the profile could reach
     * @apiSuccess {String} error Represent potential error (Should be null on success).
     * 
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "result": {score : X, maxScore: X},
     *          "error": null
     *      }
     * 
     * @apiUse UserNotFound
     * @apiUse UserNotAuthorized
     * @apiUse InternalError
     */
    server.post('/profileScoring', (req, res, next) => {
        verifyAuthorization('readScoringData', req, res, next, () => {
            if (req.header('Content-type') !== 'application/json') {
                res.json(400, JSON.stringify({
                    'result': null,
                    'error': 'Data must be a passed in json. Please refer to the documentation.'
                }));
                next();
                return;
            }

            //Profile passed in request's body
            let profile = null
            try {
                profile = JSON.parse(req.body);
            } catch (error) {
                res.json(400, JSON.stringify({
                    'result': null,
                    'error': 'Data are not in good format. Please refer to the documentation.'
                }));
                next();
                return;
            }
            const scoringData = jsonScoring.getJsonScoring();
            //const maxScore = calculateMaxScore(scoringData);
            let score = scoring(scoringData, profile);
            res.json(200, JSON.stringify({
                'result': {
                    'score': score[0],
                    'maxScore': score[1]
                },
                'error': null
            }));
            next();

        });
    });
}


/*
 This function return a score for a profile, based on specific scoring datas using recurcivity
 params :
  - scoringData: a json object which represent scoring datas
  - profile: the profile to score
  - keys: used for recurcivity, don't use it
  - fillRequirements: used for recurcivity, don't use it
 
 To obtain valid score, there are some rules to follow:
  - Following json keys are reserved for scoringData and should not appear in profile : "points", "maxPoints", "minValue", "maxValue"
  - All values in arrays should have the same type
  - "points" json key must be last key in its parent object
  - Because this function compare two json object, these json object should the same structure:
        - objects with the same keys in scoringData and profile will be compared, so need to have the same type
        - use unique key in profile object is a good practice, but if two objects have the same key in different profile's subobjects,
          their parents keys should be same as the comparing object's ones in scoringData.
          e.g. : 
          profile: {mother: {name}, father:{name}} / scoringData: {mother: {name}, father:{name}}  //Both names will be compared with one's in scoringData
          profile: {mother: {name}, father:{name}} / scoringData: {mother: {name}, sister:{name}}  //Only mother's name will be compared with scoringData
 */
scoring = (scoringData, profile, keys = [], fillRequirements = true) => {
    const objectKeys = Object.keys(scoringData);
    fillRequirements = (searchJsonObjectKey(profile, keys) !== '' && searchJsonObjectKey(profile, keys) !== null && fillRequirements);
    let maxScoreField = false;

    const score = objectKeys.map((key) => {
        const localKeys = keys.slice(0);
        let localScore = 0;
        let localMax = 0;
        const valueType = math.typeof(scoringData[key]);
        switch (valueType) {
            case 'number':
                switch (key) {
                    case 'points':
                        fillRequirements ? localScore = scoringData[key] : localScore = 0;
                        localMax = scoringData[key];
                        break;
                    case 'minValue':
                        if (searchJsonObjectKey(profile, localKeys) < scoringData[key]) {
                            fillRequirements = false;
                        }
                        break;
                    case 'maxValue':
                        if (searchJsonObjectKey(profile, localKeys) > scoringData[key]) {
                            fillRequirements = false;
                        }
                        break;
                    case 'maxPoints':
                        maxScoreField = true;
                        localMax = scoringData[key];
                        break;
                    default:
                        keys.push(key);
                        if (scoringData[key] !== searchJsonObjectKey(profile, localKeys)) {
                            fillRequirements = false;
                        }
                }
                break;
            case 'string':
                localKeys.push(key);
                if (scoringData[key] !== searchJsonObjectKey(profile, localKeys) && scoringData[key] !== "") {
                    fillRequirements = false;
                }
                break;
            case 'Object':
                localKeys.push(key)
                let result = scoring(scoringData[key], profile, localKeys);
                localScore = result[0];
                localMax = result[1];
                break;
            case 'Array':
                let sameType = true;
                let type = math.typeof(scoringData[key][0]);
                scoringData[key].map((value) => {
                    if (math.typeof(value) !== type) {
                        sameType = false;
                    }
                });
                if (!sameType) {
                    fillRequirements = false;
                }
                switch (type) {
                    case 'string':
                        const profileValue = searchJsonObjectKey(profile, localKeys);
                        if (profileValue !== 'undefined' && !scoringData[key].includes(profileValue)) {
                            fillRequirements = false;
                        }
                        break;
                    case 'Object':
                        localKeys.push(key)
                        let i = 0;
                        while (i < scoringData[key].length && !(maxScoreField && localScore)) {
                            let result = scoring(scoringData[key][i], profile, localKeys, fillRequirements);
                            if (!localScore) {
                                localScore = result[0];
                            }
                            if (result[1] > localMax || result[2]) {
                                localMax = result[1];
                            }
                            maxScoreField = result[2];
                            i++;
                        }
                        maxScoreField = false;
                        break;
                    default: console.log('autre');
                }
                break;
            default:
                console.log(valueType);
        }
        return { 'score': localScore, 'maxScore': localMax };
    });

    let result = sumScoreValues(score, maxScoreField);
    return result;
}

/**
 * In the main scoring function, the map() function return scores in matrix, 
 * so we used this function to sum this score and transform it to a simple array.
 * It takes an array in param and a boolean to inform the presence of a "maxPoints" field in scoring data. Default is false 
 * (Only use this boolean in the main scoring function).
 * 
 * The function return a simple array with the score, the max possible score for this profile, and the boolean passed in param (Default is false)
 */
sumScoreValues = (array, maxScoreField = false) => {
    let score = 0;
    let maxScore = 0;
    if (math.typeof(array) === 'Array') {
        for (let value of array) {
            if (math.typeof(value.score) === 'number') {
                score += value.score;
            }
            else {
                let castValue = parseInt(value.score, 10);
                isNaN(castValue) ? score += 0 : score += castValue;
            }
            if (!maxScoreField) {
                if (math.typeof(value.maxScore) === 'number') {
                    maxScore += value.maxScore;
                }
                else {
                    let castValue = parseInt(value.maxScore, 10);
                    isNaN(castValue) ? maxScore += 0 : maxScore += castValue;
                }
            }
            else {
                if (math.typeof(value.maxScore) === 'number') {
                    if (value.maxScore > maxScore) {
                        maxScore = value.maxScore;
                    }
                }
                else {
                    let castValue = parseInt(value.maxScore, 10);
                    if(!isNaN(castValue) && castValue > maxScore){
                        maxScore = castValue;
                    }
                }
            }
        }
    }
    return [score, maxScore, maxScoreField];
}