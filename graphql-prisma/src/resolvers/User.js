import getUserId from '../utils/getUserId';
import prisma from '../prisma';

const User = {
    email: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, {request}, info) {
            const userId = getUserId(request, false);
            if (userId && userId === parent.id) {
                return parent.email;
            } else {
                return null;
            };
        }
    },
    posts: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, {prisma}, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            });
        }
    }
};

export default User;