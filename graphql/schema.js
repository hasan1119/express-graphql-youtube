const { GraphQLSchema } = require("graphql");
const { RootQueryType, RootMutationType } = require("./types");

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

module.exports = { schema };
