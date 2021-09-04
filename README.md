# Demo api with NodeJS, ExpressJS, AWS SDK & DynamoDB (Local)

<hr />

`Author:` Arijit Banerjee

`Technologies Used:` NodeJS, ExpressJS, Express-Validator, UUID, Morgan, Helmet, Dotenv, AWS-SDK, DynamoDB

<hr />

## Instruction:

#### To setup this API, follow the instructions carefully:

1.  Rename the '.env.sample' file into '.env'.
2.  Setup the .env variables in the .env file according to your DynamoDB Configuration.
3.  After that, to setup the Database Tables automatically, run this following command in a terminal:

        npm run setup-table

4.  Now you can use the api accordingly.

NOTE: To delete the table after testing the api, run the following command:

    npm run delete-table

<hr />

## API Routes:

GET - `/api/todos` : Get all Todos from DB

GET - `/api/todos/:id` : Get one Todo item by ID

POST - `/api/todos` : Create/Post a New Todo item

PUT - `/api/todos/:id` : Update a Todo item

PATCH - `/api/todos/:id` : Change 'Completed' Status of a Todo item.

DELETE - `/api/todos/:id` : Delete a Todo item

<hr />
