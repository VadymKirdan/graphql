import { GraphQLServer } from 'graphql-yoga';

// users data
const users = [{ 
    id: '1',
    name: 'John',
    email: 'john@example.com'
}, {
    id: '2',
    name: 'Ivan',
    email: 'ivan@example.com',
    age: 20
}, {
    id: '3',
    name: 'Vasya',
    email: 'vasya@example.com'
}]

// posts data
const posts = [{
    id: '1',
    title: 'first',
    body: 'first body',
    published: true,
    author: '1'
},{
    id: '2',
    title: 'second',
    body: 'second body',
    published: false,
    author: '1'
},{
    id: '3',
    title: 'third',
    body: 'third body',
    published: false,
    author: '2'
}]

const typeDefs = `
    type Query {
        users: [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`;

const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            return users;
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }
            return posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
            });
        },
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
    },
    Post: {
        //parent - post
        author(parent, args, ctx, info) {
            const authorId = parent.author;
            return users.find((user) => {
                return user.id === authorId;
            });
        }
    },
    User: {
        //parent - user
        posts(parent, args, ctx, info) {
            const userId = parent.id;
            return posts.filter((post) => {
                return post.author === userId;
            });
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