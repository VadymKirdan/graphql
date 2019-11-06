import getUserId from '../utils/getUserId';

const Query = {
    users(parent, args, {prisma}, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip
        };

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }
        return prisma.query.users(opArgs, info);
    },
    posts(parent, args, {prisma}, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                published: true
            }
        };
        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        };
        return prisma.query.posts(opArgs, info);
    },
    comments(parent, args, {prisma}, info) {
        return prisma.query.comments(null, info);
    },
    myPosts(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const opArgs = {
            where: {
                author: {
                    id: userId
                }
            }
        }
        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }];
        };
        return prisma.query.posts(opArgs, info);
    },
    async post(parent, args, {prisma, request}, info) {
        const userId = getUserId(request, false);
        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [
                    {
                        published: true
                    },
                    {
                        author: {
                            id: userId
                        }
                    }
                ]
            }
        });

        if (posts.length === 0) {
            throw new Error('Post is not found!');
        }
        const [post] = posts;
        return post;
    },
    me(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        return prisma.query.user({
            where: {
                id: userId
            }
        });
    }
};

export default Query;