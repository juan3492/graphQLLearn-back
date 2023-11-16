import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

//

const typeDefs = `
type PokemonType {
  name: String
}

type PokemonStat {
  base_stat: Int
  stat: PokemonType
}

type Pokemon {
  id: Int
  name: String
  types: [PokemonType]
  stats: [PokemonStat]
}  

  type User {
    id: ID
    name: String!
    email: String!
  }

  type Query {
    hello: String,
    users: [User]
    user(id: ID): User
    pokemons: [Pokemon]
  }

  type Mutation {
    createUser(name: String, email: String): User
    addPokemon(input: PokemonInput): Pokemon
  }

  input PokemonInput {
    name: String
    types: [String]
    stats: [PokemonStatInput]
  }

  input PokemonStatInput {
    base_stat: Int
    stat_name: String
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
    pokemons: () => pokemons,
  },
  Mutation: {
    createUser: (root, args) => {
      const user = { id: users.length + 1, name: args.name, email: args.email };
      users.push(user);
      return user;
    },
    addPokemon: (root, args) => {
      const pokemon = {
        id: pokemons.length + 1,
        name: args.input.name,
        types: args.input.types.map((typeName) => ({ name: typeName })),
        stats: args.input.stats.map((stat) => ({
          base_stat: stat.base_stat,
          stat: { name: stat.stat_name },
        })),
      };
      pokemons.push(pokemon);
      return pokemon;
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
