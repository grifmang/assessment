// Update with your config settings.
const dotenv = require('dotenv');
dotenv.config();

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgresql://postgres:1234@localhost:5432/postgres',
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: "postgres://fzrblxhaudsziv:acaa5542f6114b05cb09d7f8f129e5a893abd74c581444338aa51426e8ad8f21@ec2-52-205-61-60.compute-1.amazonaws.com:5432/d3jag7k570k73&ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory",
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    ssl: true
  }

};
