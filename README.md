
# Chatbot

Backend with rest-api and authorization


## Installation

Install the project with npm

If you don't have npm install, you can install in the next link:

[Install npm](https://nodejs.org/en/download)

Already having installed npm we proceed to open the project and write in the project terminal the following command:

```bash
  git clone https://github.com/lobobot1/testBackend.git
  npm i
```

After you have installed all the necessary dependencies proceed to locate the file ".env.example" and make a copy of it, after having said duplicate change its name to ". env" and enter the required credentials and/or tokens


## Environment Variables

To run this project, you will need to complete the following environment variables to your .env file

`DATABASE_URL`

`JWT_SECRET`

IMPORTANT, make sure the back secret equals the front secret. To configure the database url please enter the following [link](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql) to know what to change, I did everything with postgresql
