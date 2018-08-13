const fs = require('fs');
const accessJsonFile = require('./accessJsonFile');

/*
This function verify if user is authorized by reading the header 'Authorization' and compare it with AuthorizedUsers.json
params:
    - neededRight: a right that user need to have to continue (rights are defined in 'authorizedUsers.json). 
        if no right is needed, set neededRight to null
    - req: request of the client
    - res: response to the client
    - next function to send response to client
    - callback: function called after verification if the user is allowed to continue
*/
module.exports = (neededRight, req, res, next, callback) => {
    const AuthorizationHeader = req.header('Authorization');
    if (!AuthorizationHeader) {
        res.json(200, JSON.stringify({
            'result': null,
            'error': 'Please fill Authorization header with credentials as indicate in documentation.'
        }));
        next();
        return;
    }
    else {
        const [login, password] = Buffer.from(AuthorizationHeader.slice(6), 'base64').toString('ascii').split(':');
        accessJsonFile.read('authorizedUsers.json', (authorizedUsers, err) => {
            if (err) {
                console.log(err);
                res.json(200, JSON.stringify({
                    'result': null,
                    'error': 'Service experienced internal error, we apologize for the inconveniant. Please retry later.'
                }));
                next();
                return;
            }
            const loggedUser = authorizedUsers.users.filter((user) => {
                return (user.login === login && user.password === password);
            });
            if (loggedUser.length === 0) {
                res.json(200, JSON.stringify({
                    'result': null,
                    'error': 'User not found, please verify your credentials.'
                }));
                next();
                return;
            }
            else if (loggedUser.length > 1) {
                console.error("More than one user has the same credentials");
            }
            else {
                if(!neededRight){
                    return callback();
                }
                const userRole = authorizedUsers.roles.filter((role) => {
                    return (role.role === loggedUser[0].role);
                })
                if (userRole.length === 0) {
                    res.json(200, JSON.stringify({
                        'result': null,
                        'error': 'Service experienced internal error, we apologize for the inconveniant. Please retry later.'
                    }));
                    next();
                    return;
                }
                const userRight = userRole[0].rights.filter((right) => {
                    return (right.right === neededRight && right.allowed);
                })
                if (userRight.length === 0) {
                    res.json(200, JSON.stringify({
                        'result': null,
                        'error': 'User is not allowed to continue this action, please contact administrator to get more rights.'
                    }));
                    next();
                    return;
                }
                return callback();
            }
        });
    }
}