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
}];
// posts data
const posts = [{
    id: '1',
    title: 'first',
    body: 'first body',
    published: true,
    author: '1'
}, {
    id: '2',
    title: 'second',
    body: 'second body',
    published: false,
    author: '3'
}, {
    id: '3',
    title: 'third',
    body: 'third body',
    published: false,
    author: '3'
}];
// comments data
const comments = [
    {id: '1', text: 'first comment', author: '2', post: '1'},
    {id: '2', text: 'second comment', author: '3', post: '1'},
    {id: '3', text: 'third comment', author: '2', post: '1'},
    {id: '4', text: 'fourth comment', author: '1', post: '3'}
];

const typeDefs = `
    type Query {
        users: [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        comments(parent, args, ctx, info) {
            return comments;
        }
    },
    Post: {
        //parent - post
        author(parent, args, ctx, info) {
            const authorId = parent.author;
            return users.find((user) => {
                return user.id === authorId;
            });
        },
        comments(parent, args, ctx, info) {
            const postId = parent.id;
            return comments.filter((comment) => {
                return comment.post === postId;
            });
        }
    },
    Comment: {
        //parent - comment
        author(parent, args, ctx, info) {
            const authorId = parent.author;
            return users.find((user) => {
                return user.id === authorId;
            });
        },
        post(parent, args, ctx, info) {
            const postId = parent.post;
            return posts.find((post) => {
                return postId === post.id;
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
        },
        comments(parent, args, ctx, info) {
            const userId = parent.id;
            return comments.filter((comment) => {
                return comment.author === userId;
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