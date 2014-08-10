define({ api: [
  {
    "type": "delete",
    "url": "/items/:item_id",
    "title": "Delete an existing item",
    "name": "DeleteItem",
    "group": "Items",
    "version": "0.1.0",
    "permission": {
      "name": "authenticated",
      "title": "",
      "description": ""
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "item_id",
            "optional": false,
            "description": "<p>The unique identifier for the item.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>Unique identifier for the item</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>The item&#39;s name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "size",
            "optional": false,
            "description": "<p>The size variant name</p>"
          },
          {
            "group": "Success 200",
            "type": "decimal",
            "field": "price",
            "optional": false,
            "description": "<p>The price for this variant</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n[\n   {\n       \"id\": \"2\",\n       \"name\": \"Buffalo Wings\",\n       \"size\": \"12 pieces\",\n       \"price\": 15\n   },\n   {\n       \"id\": \"3\",\n       \"name\": \"Buffalo Wings\",\n       \"size\": \"16 pieces\",\n       \"price\": 17\n   },\n   {\n       \"id\": \"1\",\n       \"name\": \"Buffalo Wings\",\n       \"size\": \"8 pieces\",\n       \"price\": 10.5\n   }\n]\n"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "field": "NoAccessRight",
            "optional": false,
            "description": "<p>Only authenticated users can access the data</p>"
          },
          {
            "group": "Error 4xx",
            "field": "InvalidItemId",
            "optional": false,
            "description": "<p>No item was found with the supplied id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "   HTTP/1.1 404 Not found\n   {\n     \"error\": \"InvalidItemId\"\n   }\n"
        }
      ]
    },
    "filename": "./items.js"
  },
  {
    "type": "get",
    "url": "/items/:item_id",
    "title": "Return the data of a single item",
    "name": "GetItem",
    "group": "Items",
    "version": "0.1.0",
    "permission": {
      "name": "authenticated",
      "title": "",
      "description": ""
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "item_id",
            "optional": false,
            "description": "<p>The unique identifier for the item.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>Unique identifier for the item</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "category_id",
            "optional": false,
            "description": "<p>The containing category unique identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>The item name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n  {\n      \"id\": 1,\n      \"category_id\": 1,\n      \"name\": \"Buffalo Wings\"\n  }\n"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "field": "NoAccessRight",
            "optional": false,
            "description": "<p>Only authenticated users can access the data</p>"
          },
          {
            "group": "Error 4xx",
            "field": "InvalidItemId",
            "optional": false,
            "description": "<p>No item was found with the supplied id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "   HTTP/1.1 404 Not found\n   {\n     \"error\": \"InvalidItemId\"\n   }\n"
        }
      ]
    },
    "filename": "./items.js"
  },
  {
    "type": "get",
    "url": "/items",
    "title": "Return the collection of items",
    "description": "<p>Results optionally can be filtered with a category or a menu.</p>",
    "name": "GetItems",
    "group": "Items",
    "version": "0.1.0",
    "permission": {
      "name": "authenticated",
      "title": "",
      "description": ""
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "menu_id",
            "optional": false,
            "description": "<p>(optional)The unique identifier for a menu to filter the set with.</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "category_id",
            "optional": false,
            "description": "<p>(optional)The unique identifier for a category to filter the set with.</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "include_sizes",
            "optional": false,
            "description": "<p>(optional)Whether to include the full sizes array with each item or not. Boolean</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>Unique identifier for the item</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "category_id",
            "optional": false,
            "description": "<p>The containing category unique identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>The item name</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "field": "sizes",
            "optional": false,
            "description": "<p>(If include_sizes was sent)An array of sizes attached to the item</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n   [\n  {\n      \"id\": 1,\n      \"category_id\": 1,\n      \"name\": \"Buffalo Wings\",\n      \"sizes\": [\n          {\n              \"size\": \"8 pieces\",\n              \"price\": 10.5\n          },\n          {\n              \"size\": \"12 pieces\",\n              \"price\": 15\n          },\n          {\n              \"size\": \"16 pieces\",\n              \"price\": 17\n          },\n          {\n              \"size\": \"20 pieces\",\n              \"price\": 21\n          },\n          {\n              \"size\": \"20 pieces\",\n              \"price\": 21\n          }\n      ]\n  },\n  {\n      \"id\": 4,\n      \"category_id\": 2,\n      \"name\": \"Margrita\",\n      \"sizes\": [\n          {\n              \"size\": \"small\",\n              \"price\": 15\n          },\n          {\n              \"size\": \"medium\",\n              \"price\": 23\n          },\n          {\n              \"size\": \"large\",\n              \"price\": 35\n          }\n      ]\n  }\n]\n"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "field": "NoAccessRight",
            "optional": false,
            "description": "<p>Only authenticated users can access the data</p>"
          },
          {
            "group": "Error 4xx",
            "field": "InvalidMenuId",
            "optional": false,
            "description": "<p>No menu was found with the supplied id</p>"
          },
          {
            "group": "Error 4xx",
            "field": "InvalidCategoryId",
            "optional": false,
            "description": "<p>No category was found with the supplied id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "   HTTP/1.1 401 Not Authenticated\n   {\n     \"error\": \"NoAccessRight\"\n   }\n"
        }
      ]
    },
    "filename": "./items.js"
  },
  {
    "type": "post",
    "url": "/items",
    "title": "Insert a new item",
    "name": "PostItem",
    "group": "Items",
    "version": "0.1.0",
    "permission": {
      "name": "authenticated",
      "title": "",
      "description": ""
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "category_id",
            "optional": false,
            "description": "<p>(required)The unique identifier for the containing category.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>(required)A name for the item</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>The id for the inserted entity</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n  {\n      \"id\": 1\n  }\n"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "field": "NoAccessRight",
            "optional": false,
            "description": "<p>Only authenticated users can access the data</p>"
          },
          {
            "group": "Error 4xx",
            "field": "RequiredDataMissing",
            "optional": false,
            "description": "<p>A required data is missing</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "   HTTP/1.1 500 Server error\n   {\n     \"error\": \"RequiredDataMissing\"\n   }\n"
        }
      ]
    },
    "filename": "./items.js"
  },
  {
    "type": "put",
    "url": "/items/:item_id",
    "title": "Update the data for an existing item",
    "name": "PutItem",
    "group": "Items",
    "version": "0.1.0",
    "permission": {
      "name": "authenticated",
      "title": "",
      "description": ""
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "item_id",
            "optional": false,
            "description": "<p>The unique identifier for the item.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>The id for the updated entity</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n  {\n      \"id\": 1\n  }\n"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "field": "NoAccessRight",
            "optional": false,
            "description": "<p>Only authenticated users can access the data</p>"
          },
          {
            "group": "Error 4xx",
            "field": "InvalidItemId",
            "optional": false,
            "description": "<p>No item was found with the supplied id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "   HTTP/1.1 404 Not found\n   {\n     \"error\": \"InvalidItemId\"\n   }\n"
        }
      ]
    },
    "filename": "./items.js"
  },
  {
    "type": "post",
    "url": "/items/search",
    "title": "Search and filter items using a  keyword",
    "name": "SearchItem",
    "group": "Items",
    "version": "0.1.0",
    "permission": {
      "name": "authenticated",
      "title": "",
      "description": ""
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "keyword",
            "optional": false,
            "description": "<p>The keyword to filter the result by</p>"
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
            "field": "A",
            "optional": false,
            "description": "<p>status message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n  {\n      \"deleted\"\n  }\n"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "field": "NoAccessRight",
            "optional": false,
            "description": "<p>Only authenticated users can access the data</p>"
          },
          {
            "group": "Error 4xx",
            "field": "InvalidItemId",
            "optional": false,
            "description": "<p>No item was found with the supplied id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "   HTTP/1.1 404 Not found\n   {\n     \"error\": \"InvalidItemId\"\n   }\n"
        }
      ]
    },
    "filename": "./items.js"
  }
] });