const AWS = require("aws-sdk");

// Setting Up and Updating AWS SDK Default Config
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// AWS SDK DynamoDB Client
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();

// DynamoDB Table
const TableName = process.env.AWS_TABLE_NAME;

// Helper Methods

// Get All Todos
const getTodos = async () => {
  const params = {
    TableName,
  };

  const todos = await dynamoDBClient.scan(params).promise();
  return todos;
};

// Get one todo by ID
const getTodoByID = async (id) => {
  const params = {
    TableName,
    Key: {
      id,
    },
  };

  const todo = await dynamoDBClient.get(params).promise();
  return todo;
};

// Add a New Todo
const addNewTodo = async (Item) => {
  const params = {
    TableName,
    Item,
  };

  const newTodo = await dynamoDBClient.put(params).promise();
  return newTodo;
};

// Update a Todo
const updateTodo = async (id, todo) => {
  // Checking if Todo Item exists
  let params = {
    TableName,
    Key: { id },
  };

  const checkTodo = await dynamoDBClient.get(params).promise();
  //   If doesn't exist, returning null
  if (!checkTodo.Item) {
    return null;
  }

  //   Else, updating item
  params = {
    TableName,
    Item: { ...checkTodo.Item, ...todo },
    ReturnValues: "ALL_OLD",
  };

  //   Not Using dynamoDBClient.update() here so that any no. of custom attributes could be added
  let updatedTodo = await dynamoDBClient.put(params).promise();
  //   updateTodo = { ...updatedTodo, ...todo };
  return updatedTodo;
};

// Update Completed status of a Todo
const updateCompletedStatusOfTodo = async (id) => {
  // Checking if Todo Item exists
  let params = {
    TableName,
    Key: { id },
  };

  const checkTodo = await dynamoDBClient.get(params).promise();
  //   If doesn't exist, returning null
  if (!checkTodo.Item) {
    return null;
  }

  //   Else, updating item
  params = {
    TableName,
    Key: { id },
    UpdateExpression: "set completed = :completedStatus",
    ConditionExpression: "id = :todoId",
    ExpressionAttributeValues: {
      ":todoId": id,
      ":completedStatus": !checkTodo.Item.completed,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedTodo = await dynamoDBClient.update(params).promise();
  return updatedTodo;
};

// Delete a Todo by ID
const deleteTodo = async (id) => {
  const params = {
    TableName,
    Key: {
      id,
    },
    ReturnValues: "ALL_OLD",
  };

  const deletedTodo = await dynamoDBClient.delete(params).promise();
  return deletedTodo;
};

//  Export Helper Methods
module.exports = {
  getTodos,
  getTodoByID,
  addNewTodo,
  updateTodo,
  updateCompletedStatusOfTodo,
  deleteTodo,
};
