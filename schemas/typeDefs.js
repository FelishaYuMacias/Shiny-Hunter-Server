const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    hunts: [Hunt]!
  }

  type Hunt {
    _id: ID
    method: String
    counter: Number
    dateStarted: Date
    dateCompleted: Date
    phase: String
    game: String,
    pokemon: Pokemon
  }

  type Pokemon {
    _id: ID
    species: String
    level: Number
    form: String
    gender: String
 }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    hunts:(username: String):[Hunt]
    hunt:(huntId:ID!): Hunt
    pokemon(pokemonId:ID!): Pokemon
    me: User
  }

  type Mutation {
    addUser(username: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
    addHunt(method: String,
        counter: Number,
        dateStarted: Date,
        dateCompleted: Date,
        phase: String,
        game: String): Hunt
    addPokemon(species: String,
        level: Number,
        form: String,
        gender: String): Pokemon
    removeHunt(huntId: ID!): Hunt
    removePokemon(pokemonId: ID!): Pokemon
    
  }
`;

module.exports = typeDefs;



