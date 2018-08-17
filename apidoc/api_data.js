define({ "api": [
  {
    "type": "delete",
    "url": "/scoringData/position",
    "title": "Delete scoring data of one position.",
    "name": "DeletePositionScoringData",
    "group": "ScoringData",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>String that confirm that data is deleted.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Represent potential error (Should be null on success).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": {...scoringData...},\n    \"error\": null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/scoringDataRoutes.js",
    "groupTitle": "ScoringData",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User credentials (base64 encoded)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Authorization: ",
          "content": "\"Basic *login:password*\" (Credentials between stars (*) must be base64 encoded)",
          "type": "String"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The credentials of the user was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotAuthorized",
            "description": "<p>The user has no right to execute this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Service experienced internal error</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DataNotFound",
            "description": "<p>The position you mentioned was not found in scoring data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UserNotFound",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"result\": null,\n    \"error\": \"User not found, please verify your credentials.\"\n}",
          "type": "json"
        },
        {
          "title": "UserNotAuthorized",
          "content": "HTTP/1.1 403 Forbidden\n{\n    \"result\": null,\n    \"error\": \"User is not allowed to continue this action, please contact administrator to get more rights.\"\n}",
          "type": "json"
        },
        {
          "title": "InternalError",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"result\": null,\n    \"error\": \"Service experienced internal error, we apologize for the inconveniant. Please retry later.\"\n}",
          "type": "json"
        },
        {
          "title": "DataNotFound:",
          "content": "HTTP/1.1 204 No Content\n{\n    \"result\": \"No position found with the title you gave\",\n    \"error\": null\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/scoringData/position",
    "title": "Request scoring data of one position.",
    "name": "GetPositionScoringData",
    "group": "ScoringData",
    "permission": [
      {
        "name": "User"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": "<p>Json object representing scoring data.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Represent potential error (Should be null on success).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": {...scoringData...},\n    \"error\": null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/scoringDataRoutes.js",
    "groupTitle": "ScoringData",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User credentials (base64 encoded)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Authorization: ",
          "content": "\"Basic *login:password*\" (Credentials between stars (*) must be base64 encoded)",
          "type": "String"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The credentials of the user was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotAuthorized",
            "description": "<p>The user has no right to execute this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Service experienced internal error</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DataNotFound",
            "description": "<p>The position you mentioned was not found in scoring data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UserNotFound",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"result\": null,\n    \"error\": \"User not found, please verify your credentials.\"\n}",
          "type": "json"
        },
        {
          "title": "UserNotAuthorized",
          "content": "HTTP/1.1 403 Forbidden\n{\n    \"result\": null,\n    \"error\": \"User is not allowed to continue this action, please contact administrator to get more rights.\"\n}",
          "type": "json"
        },
        {
          "title": "InternalError",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"result\": null,\n    \"error\": \"Service experienced internal error, we apologize for the inconveniant. Please retry later.\"\n}",
          "type": "json"
        },
        {
          "title": "DataNotFound:",
          "content": "HTTP/1.1 204 No Content\n{\n    \"result\": \"No position found with the title you gave\",\n    \"error\": null\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/scoringData",
    "title": "Request scoring data.",
    "name": "GetScoringData",
    "group": "ScoringData",
    "permission": [
      {
        "name": "User"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": "<p>Json object representing scoring data.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Represent potential error (Should be null on success).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": {...scoringData...},\n    \"error\": null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/scoringDataRoutes.js",
    "groupTitle": "ScoringData",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User credentials (base64 encoded)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Authorization: ",
          "content": "\"Basic *login:password*\" (Credentials between stars (*) must be base64 encoded)",
          "type": "String"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The credentials of the user was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotAuthorized",
            "description": "<p>The user has no right to execute this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Service experienced internal error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UserNotFound",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"result\": null,\n    \"error\": \"User not found, please verify your credentials.\"\n}",
          "type": "json"
        },
        {
          "title": "UserNotAuthorized",
          "content": "HTTP/1.1 403 Forbidden\n{\n    \"result\": null,\n    \"error\": \"User is not allowed to continue this action, please contact administrator to get more rights.\"\n}",
          "type": "json"
        },
        {
          "title": "InternalError",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"result\": null,\n    \"error\": \"Service experienced internal error, we apologize for the inconveniant. Please retry later.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/scoringData/position",
    "title": "Add scoring data for one position",
    "name": "PostPositionScoringData",
    "group": "ScoringData",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>String that confirm that data is inserted.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Represent potential error (Should be null on success).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": \"Position Scoring data is inserted\",\n    \"error\": null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/scoringDataRoutes.js",
    "groupTitle": "ScoringData",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User credentials (base64 encoded)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Authorization: ",
          "content": "\"Basic *login:password*\" (Credentials between stars (*) must be base64 encoded)",
          "type": "String"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The credentials of the user was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotAuthorized",
            "description": "<p>The user has no right to execute this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Service experienced internal error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UserNotFound",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"result\": null,\n    \"error\": \"User not found, please verify your credentials.\"\n}",
          "type": "json"
        },
        {
          "title": "UserNotAuthorized",
          "content": "HTTP/1.1 403 Forbidden\n{\n    \"result\": null,\n    \"error\": \"User is not allowed to continue this action, please contact administrator to get more rights.\"\n}",
          "type": "json"
        },
        {
          "title": "InternalError",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"result\": null,\n    \"error\": \"Service experienced internal error, we apologize for the inconveniant. Please retry later.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/scoringData",
    "title": "Update scoring data.",
    "name": "PostScoringData",
    "group": "ScoringData",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body",
            "description": "<p>New Json object (It must be stringify) representing scoring data. Be carefull with these data, by changing them, you can make the service unable to work !</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>String that confirm that data is updated</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Represent potential error (Should be null on success).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": \"Scoring data is updated\",\n    \"error\": null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/scoringDataRoutes.js",
    "groupTitle": "ScoringData",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User credentials (base64 encoded)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Authorization: ",
          "content": "\"Basic *login:password*\" (Credentials between stars (*) must be base64 encoded)",
          "type": "String"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The credentials of the user was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotAuthorized",
            "description": "<p>The user has no right to execute this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Service experienced internal error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UserNotFound",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"result\": null,\n    \"error\": \"User not found, please verify your credentials.\"\n}",
          "type": "json"
        },
        {
          "title": "UserNotAuthorized",
          "content": "HTTP/1.1 403 Forbidden\n{\n    \"result\": null,\n    \"error\": \"User is not allowed to continue this action, please contact administrator to get more rights.\"\n}",
          "type": "json"
        },
        {
          "title": "InternalError",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"result\": null,\n    \"error\": \"Service experienced internal error, we apologize for the inconveniant. Please retry later.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/profileScoring",
    "title": "Score a profile",
    "name": "ScoreProfile",
    "group": "Scoring",
    "permission": [
      {
        "name": "User"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": "<p>Object which contain the obtained score and the max score the profile could reach</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Represent potential error (Should be null on success).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": {score : X, maxScore: X},\n    \"error\": null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/scoringRoutes.js",
    "groupTitle": "Scoring",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User credentials (base64 encoded)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Authorization: ",
          "content": "\"Basic *login:password*\" (Credentials between stars (*) must be base64 encoded)",
          "type": "String"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The credentials of the user was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotAuthorized",
            "description": "<p>The user has no right to execute this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Service experienced internal error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UserNotFound",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"result\": null,\n    \"error\": \"User not found, please verify your credentials.\"\n}",
          "type": "json"
        },
        {
          "title": "UserNotAuthorized",
          "content": "HTTP/1.1 403 Forbidden\n{\n    \"result\": null,\n    \"error\": \"User is not allowed to continue this action, please contact administrator to get more rights.\"\n}",
          "type": "json"
        },
        {
          "title": "InternalError",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"result\": null,\n    \"error\": \"Service experienced internal error, we apologize for the inconveniant. Please retry later.\"\n}",
          "type": "json"
        }
      ]
    }
  }
] });
