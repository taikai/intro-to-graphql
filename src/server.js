import { ApolloServer } from 'apollo-server'

let companyList = [
  {
    id: '1',
    name: 'Taikai',
    tags: ['Innovation', 'Challenges'],
    yearFounded: 2018,
    employees: [
      {
        id: '1',
        name: 'Mário Alves'
      },
      {
        id: '2',
        name: 'Helder Vasconcelos'
      }
    ]
  },
  {
    id: '2',
    name: 'AppyBook',
    tags: ['Health'],
    yearFounded: 2018,
    employees: [
      {
        id: 't1',
        name: 'Ricardo'
      }
    ]
  }
]

export const start = async () => {
  // Define Schema using SDL ( Schema Definition Language )
  const rootSchema = `
    type Company {
      id: ID!
      name: String
      tags: [String]
      yearFounded: Int!
      employees: [Person]
    }  

    type Person {
      id: ID!
      name: String
      company: Company
    }

    input CompanyInput {
      name: String!
      tags: [String]
      yearFounded: Int!
    }

    type Query {
      companies: [Company]
    }

    type Mutation {
      addCompany(data: CompanyInput): Company! 
    }

    schema {
      query: Query
      mutation: Mutation
    }
  `

  const resolvers = {
    Query: {
      companies: (_, args, context, info) => {
        if (!context.user.isLoggedIn) {
          return []
        } else {
          return companyList
        }
      }
    },
    Mutation: {
      addCompany: (_, args) => {
        const { data } = args
        const newCompany = {
          id: Date.now(),
          name: data.name,
          tags: data.tags,
          yearFounded: data.yearFounded
        }
        companyList.push(newCompany)

        return newCompany
      }
    }
  }

  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: resolvers,
    context: req => {
      // example auth: const user = checkAuth(req)
      return { user: { isLoggedIn: true } }
    }
  })

  const { url } = await server.listen({ port: 3000 })

  console.log(`GQL server ready at ${url}`)
}
