# Northcoders Board Game Fun API

[Linked to hosted version](https://board-game-fun.herokuapp.com/api)

## Summary of Project

This server is a backend API, which allows users to retrieve and interact with information about various boardgames, including reviews, comments, categories and user data. For information about all the endpoints and how to interact with them please visit the /api on the hosted version.

## How to Set Up

1. To set up locally you need to clone this repository locally and install the following dependencies with `npm install`:

- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [PostgreSQL](https://www.postgresql.org/)

2. To run this project locally, you must create two .env files at the root to allow you to connect to the test and development databases:

- FILE NAME: .env.development CONTENTS: PGDATABASE=nc_games
- FILE NAME: .env.test CONTENTS: PGDATABASE=nc_games_test

3. Setting up these environment variables will allow you to run the test database when you are running the tests, otherwise it will run the development database.

4. To create the database `npm run setup-dbs`. To seed the database `npm run seed`. You will then be able to run tests locally, the database is automatically reseeded at the start of the tests.

5. Please note this project requires Node.js v17.8.0 or higher, and PostgreSQL 14.2 or higher.
