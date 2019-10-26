const Mutation = {
    async createUser(parent, args, {prisma}, info) {
        return prisma.mutation.createUser({data: args.data}, info);
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