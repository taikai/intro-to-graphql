import { ApolloServer } from 'apollo-server'

export const start = async () => {
  // Define Schema using SDL ( Schema Definition Language )
  const rootSchema = `
    type Query {
      hello: String
    }
    schema {
      query: Query
    }
  `

  const resolvers = {}

  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: resolvers
  })

  const { url } = await server.listen({ port: 3000 })

  console.log(`GQL server ready at ${url}`)
}
