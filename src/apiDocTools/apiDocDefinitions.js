 /**
     * @apiDefine Credentials
     * @apiHeader {String} Authorization User credentials (base64 encoded)
     * 
     * @apiHeaderExample {String} Authorization: 
     *      "Basic *login:password*" (Credentials between stars (*) must be base64 encoded) 
     */

    /**
     * @apiDefine UserNotFound
     * 
     * @apiError UserNotFound The credentials of the user was not found.
     * 
     * @apiErrorExample UserNotFound
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
     * @apiErrorExample UserNotAuthorized
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
     * @apiErrorExample InternalError
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *         "result": null,
     *         "error": "Service experienced internal error, we apologize for the inconveniant. Please retry later."
     *     }
     */

     /**
      * @apiDefine DataNotFound
      * 
      * @apiError DataNotFound The position you mentioned was not found in scoring data
      * 
      * @apiErrorExample DataNotFound:
      *     HTTP/1.1 204 No Content
      *     {
      *         "result": "No position found with the title you gave",
      *         "error": null
      *     }
      */