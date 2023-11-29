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

  type Query {
    hello: String,
    pokemons: [Pokemon]
  }

  type Mutation {
    addPokemon(input: PokemonInput): Pokemon
    deletePokemon(id: ID!): Pokemon
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


const pokemons = [];
let idCounter = 0;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
    pokemons: () => pokemons,
  },
  Mutation: {
    addPokemon: (root, args) => {
      const pokemon = {
        id: idCounter,
        name: args.input.name,
        types: args.input.types.map((typeName) => ({ name: typeName })),
        stats: args.input.stats.map((stat) => ({
          base_stat: stat.base_stat,
          stat: { name: stat.stat_name },
        })),
      };
      pokemons.push(pokemon);
      idCounter++;
      return pokemon;
    },
    deletePokemon: (root, args) => {
      const index = pokemons.findIndex(pokemon => pokemon.id === parseInt(args.id));

      if (index !== -1) {
        const deletedPokemon = pokemons.splice(index, 1)[0];
        return deletedPokemon;
      }
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
