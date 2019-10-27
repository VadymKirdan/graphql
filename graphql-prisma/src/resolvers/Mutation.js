import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
            token: jwt.sign({userId: user.id}, 'thisisasecret')
        };
    },
    async createUser(parent, args, {prisma}, info) {
        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 characters or longer!');
        };
        const password = await bcrypt.hash(args.data.password, 10);
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        });
        return {
            user,
            token: jwt.sign({userId: user.id}, 'thisisasecret')
        };
    },
    async deleteUser(parent, args, {prisma}, info) {
        // instead of const user = await prisma... and returning user
        return prisma.mutation.deleteUser({where: {id: args.id}}, info);
    },
    async updateUser(parents, args, {prisma}, info) {
        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    },
    async createPost(parent, args, {prisma}, info) {
        const data = args.data;
        return prisma.mutation.createPost({data: {
            title: data.title,
            body: data.body,
            published: data.published,
            author: {
                connect: {
                    id: data.author
                }
            }
        }}, info);
    },
    async deletePost(parent, args, {prisma}, info) {
        return prisma.mutation.deletePost({where: {
            id: args.id
        }}, info);
    },
    async updatePost(parent, args, {prisma}, info) {
        const data = args.data;
        return prisma.mutation.updatePost({
            data: data,
            where: {
                id: args.id
            }
        }, info);
    },
    async createComment(parent, args, {prisma}, info) {
        const data = args.data;
        return prisma.mutation.createComment({
            data: {
                text: data.text,
                author: {
                    connect: {
                        id: data.author
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
    async deleteComment(parent, args, {prisma}, info) {
        return prisma.mutation.deleteComment({where: {
            id: args.id
        }}, info);
    },
    async updateComment(parent, args, {prisma}, info) {
        return prisma.mutation.updateComment({
            data: args.data,
            where: {
                id: args.id
            }
        }, info);
    }
};

export default Mutation;