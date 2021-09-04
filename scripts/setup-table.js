require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
  region: "local",
  endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  endpoint: "http://localhost:8000", // This is for Local DynamoDB,
});

const dynamodb = new AWS.DynamoDB();
const TableName = process.env.AWS_TABLE_NAME;

const params = {
  TableName,
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }, // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" }, // Attribute Definition
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

dynamodb.createTable(params, function (err, data) {
  if (err) {
    console.error(
      "Unable to create table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      "\nTable created successfully!\n\n Table description JSON:\n",
      JSON.stringify(data, null, 2)
    );
  }
});
