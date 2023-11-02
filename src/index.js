import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

//

const typeDefs = `
  type User {
    id: ID
    name: String!
    email: String!
  }

  type Pokemon {
    id: Int
    id: Pokemon
    name: String
    type: Object
    stats:
  }

  type Query {
    hello: String,
    users: [User]
    user(id: ID): User
    pokemons: [Pokemon]
  }

  type Mutation {
    createUser(name: String, email: String): User
  }

`;

const users = [
  { id: 1, name: "lalo", email: "la@lo.com" },
  { id: 2, name: "lalo1", email: "la1@lo.com" },
  { id: 3, name: "lalo2", email: "la2@lo.com" },
];

const pokemons = [];

const resolvers = {
  Query: {
    hello: () => "Hello world!",
    users: () => users,
    user: (root, args) => {
      console.log("se ha buscado un user");
      const user = users.find((user) => user.id == args.id);
      return user;
    },
  },
  Mutation: {
    createUser: (root, args) => {
      const user = { id: users.length + 1, name: args.name, email: args.email };
      users.push(user);
      return user;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
