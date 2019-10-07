import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// users data
let users = [{ 
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
let posts = [{
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
let comments = [
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

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => {
                return user.email === args.data.email;
            });

            if (emailTaken) {
                throw new Error('Email is taken');
            }
            const user = {
                id: uuidv4(),
                ...args.data
            };
            users.push(user);
            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => {
                return user.id === args.id;
            });

            if (userIndex === -1) {
                throw new Error('User is not found!');
            }

            const removedUser = users.splice(userIndex, 1)[0];

            posts = posts.filter((post) => {
                const match = post.author === removedUser.id;

                if (match) {
                    comments = comments.filter((comment) => {
                        return comment.post !== post.id;
                    });
                }

                return !match;
            });

            comments = comments.filter((comment) => {
                return comment.author !== removedUser.id;
            });

            return removedUser;
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => {
                return user.id === args.data.author; 
            });

            if (!userExists) {
                throw new Error('User is not found');
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post);
            return post;
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => {
                return post.id === args.id;
            });

            if (postIndex === -1) {
                throw new Error('Post is not found!');
            };

            const deletedPost = posts.splice(postIndex, 1)[0];
            comments = comments.filter((comment) => {
                return comment.post !== args.id;
            });

            return deletedPost;
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => {
                return user.id === args.data.author;
            });

            if (!userExists) {
                throw new Error('User is not found');
            };

            const postExists = posts.some((post) => {
                return post.id === args.data.post && post.published;
            });

            if (!postExists) {
                throw new Error('Post doesn\'n exist or it wasn\'t published');
            };

            const comment = {
                id: uuidv4(),
                ...args.data
            };
            comments.push(comment);
            return comment;
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex((comment) => {
                return comment.id === args.id;
            });

            if (commentIndex === -1) {
                throw new Error('Comment is not found!');
            }

            const deletedComment = comments.splice(commentIndex, 1)[0];

            return deletedComment;
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