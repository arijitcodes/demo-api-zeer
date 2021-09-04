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
};

dynamodb.deleteTable(params, function (err, data) {
  if (err) {
    console.error(
      "Unable to delete table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log("Table has been Deleted Successfully!\n");
  }
});
