const schema = {
  usersPost: {
    "additionalProperties": false,
    "properties": {
      "password": {
        "id": "/properties/password",
        "type": "string"
      },
      "user": {
        "additionalProperties": false,
        "id": "/properties/user",
        "properties": {
          "email": {
            "id": "/properties/user/properties/email",
            "type": "string"
          },
          "id": {
            "id": "/properties/user/properties/id",
            "type": "integer"
          },
          "location": {
            "id": "/properties/user/properties/location",
            "type": "string"
          },
          "username": {
            "id": "/properties/user/properties/username",
            "type": "string"
          }
        },
        "required": [
          "username",
          "email",
          "id",
          "location"
        ],
        "type": "object"
      }
    },
    "required": [
      "password",
      "user"
    ],
    "type": "object"
  },
  projectPost : {
    "properties": {
      "creators": {
        "additionalItems": false,
        "id": "/properties/creators",
        "items": {
          "additionalProperties": false,
          "id": "/properties/creators/items",
          "properties": {
            "id": {
              "id": "/properties/creators/items/properties/id",
              "type": "integer"
            },
            "name": {
              "id": "/properties/creators/items/properties/name",
              "type": "string"
            }
          },
          "required": [
            "id",
            "name"
          ],
          "type": "object"
        },
        "type": "array",
        "uniqueItems": true
      },
      "description": {
        "id": "/properties/description",
        "type": "string"
      },
      "imageUri": {
        "id": "/properties/imageUri",
        "type": "string"
      },
      "rewards": {
        "additionalItems": false,
        "id": "/properties/rewards",
        "items": {
          "additionalProperties": false,
          "id": "/properties/rewards/items",
          "properties": {
            "amount": {
              "id": "/properties/rewards/items/properties/amount",
              "type": "integer"
            },
            "description": {
              "id": "/properties/rewards/items/properties/description",
              "type": "string"
            },
            "id": {
              "id": "/properties/rewards/items/properties/id",
              "type": "integer"
            }
          },
          "required": [
            "amount",
            "id",
            "description"
          ],
          "type": "object"
        },
        "type": "array",
        "uniqueItems": true
      },
      "subtitle": {
        "id": "/properties/subtitle",
        "type": "string"
      },
      "target": {
        "id": "/properties/target",
        "type": "integer"
      },
      "title": {
        "id": "/properties/title",
        "type": "string"
      }
    },
    "required": [
      "rewards",
      "subtitle",
      "target",
      "title",
      "imageUri",
      "creators",
      "description"
    ],
    "type": "object"
  },
  projectPut : {
    "additionalProperties": false,
    "properties": {
      "open": {
        "id": "/properties/open",
        "type": "boolean"
      }
    },
    "required": [
      "open"
    ],
    "type": "object"
  }, projectPledge : {
    "additionalProperties": false,
    "properties": {
      "amount": {
        "id": "/properties/amount",
        "type": "integer"
      },
      "anonymous": {
        "id": "/properties/anonymous",
        "type": "boolean"
      },
      "card": {
        "additionalProperties": false,
        "id": "/properties/card",
        "properties": {
          "authToken": {
            "id": "/properties/card/properties/authToken",
            "type": "string"
          }
        },
        "required": [
          "authToken"
        ],
        "type": "object"
      },
      "id": {
        "id": "/properties/id",
        "type": "integer"
      }
    },
    "required": [
      "card",
      "amount",
      "id",
      "anonymous"
    ],
    "type": "object"
  }
};

module.exports = schema;