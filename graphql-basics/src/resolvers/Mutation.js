import uuidv4 from 'uuid/v4';

const Mutation = {
    createUser(parent, args, {db}, info) {
        const emailTaken = db.users.some((user) => {
            return user.email === args.data.email;
        });

        if (emailTaken) {
            throw new Error('Email is taken');
        }
        const user = {
            id: uuidv4(),
            ...args.data
        };
        db.users.push(user);
        return user;
    },
    deleteUser(parent, args, {db}, info) {
        const userIndex = db.users.findIndex((user) => {
            return user.id === args.id;
        });

        if (userIndex === -1) {
            throw new Error('User is not found!');
        }

        const removedUser = db.users.splice(userIndex, 1)[0];

        db.posts = db.posts.filter((post) => {
            const match = post.author === removedUser.id;

            if (match) {
                db.comments = db.comments.filter((comment) => {
                    return comment.post !== post.id;
                });
            }

            return !match;
        });

        db.comments = db.comments.filter((comment) => {
            return comment.author !== removedUser.id;
        });

        return removedUser;
    },
    updateUser(parents, args, {db}, info) {
        const {id,data} = args;
        const user = db.users.find((user) => {
            return user.id === id;
        });

        if (!user) {
            throw new Error('User not found!');
        };

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => {
                return user.email === data.email;
            });

            if (emailTaken) {
                throw new Error('Email is already in use')
            } else {
                user.email = data.email;
            };
        };

        if (typeof data.name === 'string') {
            user.name = data.name;
        };

        if (typeof data.age !== 'undefined') {
            user.age = data.age;
        };

        return user;
    },
    createPost(parent, args, {db}, info) {
        const userExists = db.users.some((user) => {
            return user.id === args.data.author; 
        });

        if (!userExists) {
            throw new Error('User is not found');
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post);
        return post;
    },
    deletePost(parent, args, {db}, info) {
        const postIndex = db.posts.findIndex((post) => {
            return post.id === args.id;
        });

        if (postIndex === -1) {
            throw new Error('Post is not found!');
        };

        const deletedPost = db.posts.splice(postIndex, 1)[0];
        db.comments = db.comments.filter((comment) => {
            return comment.post !== args.id;
        });

        return deletedPost;
    },
    updatePost(parent, args, {db}, info) {
        const {id, data} = args;
        const post = db.posts.find((post) => {
            return post.id === id;
        });

        if (!post) {
            throw new Error('Post is not found!');
        };

        if (typeof data.title === 'string') {
            post.title = data.title;
        };
        if (typeof data.body === 'string') {
            post.body = data.body;
        };
        if (typeof data.published === 'boolean') {
            post.published = data.published;
        };

        return post;
     },
    createComment(parent, args, {db}, info) {
        const userExists = db.users.some((user) => {
            return user.id === args.data.author;
        });

        if (!userExists) {
            throw new Error('User is not found');
        };

        const postExists = db.posts.some((post) => {
            return post.id === args.data.post && post.published;
        });

        if (!postExists) {
            throw new Error('Post doesn\'n exist or it wasn\'t published');
        };

        const comment = {
            id: uuidv4(),
            ...args.data
        };
        db.comments.push(comment);
        return comment;
    },
    deleteComment(parent, args, {db}, info) {
        const commentIndex = db.comments.findIndex((comment) => {
            return comment.id === args.id;
        });

        if (commentIndex === -1) {
            throw new Error('Comment is not found!');
        }

        const deletedComment = db.comments.splice(commentIndex, 1)[0];

        return deletedComment;
    },
    updateComment(parent, args, {db}, info) {
        const {id, data} = args;
        const comment = db.comments.find((comment) => {
            return comment.id === id;
        });

        if (!comment) {
            throw new Error('Comment is not found!')
        };

        if (typeof data.text === 'string') {
            comment.text = data.text;
        };

        return comment;
    }
};

export default Mutation;