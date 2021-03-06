import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
    async login(parent, args, {prisma}, info) {
        const user = await prisma.query.user({where: {
            email: args.data.email
        }});
        if (!user) {
            throw new Error('User with this emails doesn\'t exists');
        };
        const passwordMatch = await bcrypt.compare(args.data.password, user.password);
        if (!passwordMatch) {
            throw new Error('Password doesn\'t match');
        };
        return {
            user,
            token: generateToken(user.id)
        };
    },
    async createUser(parent, args, {prisma}, info) {
        const password = await hashPassword(args.data.password);
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        });
        return {
            user,
            token: generateToken(user.id)
        };
    },
    async deleteUser(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        // instead of const user = await prisma... and returning user
        return prisma.mutation.deleteUser({where: {id: userId}}, info);
    },
    async updateUser(parents, args, {prisma, request}, info) {
        const userId = getUserId(request);

        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password);
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info);
    },
    async createPost(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const data = args.data;
        return prisma.mutation.createPost({data: {
            title: data.title,
            body: data.body,
            published: data.published,
            author: {
                connect: {
                    id: userId
                }
            }
        }}, info);
    },
    async deletePost(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!postExists) {
            throw new Error('Unable to delete post!');
        }

        return prisma.mutation.deletePost({where: {
            id: args.id
        }}, info);
    },
    async updatePost(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!postExists) {
            throw new Error('Unable to update post!');
        }

        const data = args.data;
        const postPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        });

        if (postPublished && !data.published) {
            await prisma.mutatiion.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            });
        }

        return prisma.mutation.updatePost({
            data: data,
            where: {
                id: args.id
            }
        }, info);
    },
    async createComment(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const data = args.data;

        const postExists = await prisma.exists.Post({
            id: data.post,
            published: true
        });
        if (!postExists) {
            throw new Error('Post can\'t be found!');
        } 

        return prisma.mutation.createComment({
            data: {
                text: data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: data.post
                    }
                }
            }
        }, info);
    },
    async deleteComment(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });
        if (!commentExists) {
            throw new Error('Unable to delete comment!');
        }
        return prisma.mutation.deleteComment({where: {
            id: args.id
        }}, info);
    },
    async updateComment(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });
        if (!commentExists) {
            throw new Error('Unable to update comment!');
        }
        return prisma.mutation.updateComment({
            data: args.data,
            where: {
                id: args.id
            }
        }, info);
    }
};

export default Mutation;