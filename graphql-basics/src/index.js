import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
    type Query {
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

const resolvers = {
    Query: {
        me() {
            return {
                id: '1',
                name: 'Johnny',
                email: 'johnnybanana@gmail.com',
                age: 30
            };
        },
        post() {
            return {
                id: '1_1',
                title: 'post title',
                body: 'post body',
                published: false
            }
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('Server is up!');
});