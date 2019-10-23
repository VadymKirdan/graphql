import {Prisma} from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://192.168.99.100:4466'
});

export default prisma;

/*prisma.query.users(null, '{id name email posts {id title}}').then((data) => {
    console.log(JSON.stringify(data, undefined, 2));
});*/


/*prisma.mutation.createPost({
    data: {
        title: 'new post',
        body: 'new post body',
        published: false,
        author: {
            connect: {
                id: "ck1to6ftl00100730r5kmwp0x"
            }
        }
    }
}, '{id, title, body, published, author {name}}').then((data) => {
    console.log('create post data: ', data);
});*/


/*const updatePostForUser = async (postId, data) => {
    const postExists = await prisma.exists.Post({id: postId});
    if (!postExists) {
        throw new Error('Post doesn\'t exists!');
    };

    const post = await prisma.mutation.updatePost({
        data: {...data},
        where: {
            id: postId
        }
    }, '{author {id name email posts {title body published}}}');
    return post.author;
}

updatePostForUser('ck1yw0xp8000ptanbr3l', {published: true}).then(data => {
    console.log('user data: ', JSON.stringify(data, undefined, 2));
}).catch((err) => {
    console.log(err);
});*/

/*prisma.mutation.updatePost({
        data: {
            body: 'banana',
            published: true
        },
        where: {
            id: 'ck1yw0xp8000e0730ptanbr3l'
        }
    },
    '{id title body author {name}}'
).then((data) => {
    console.log('data update: ', data);
    return prisma.query.posts(null, '{title body published}')
}).then((data) => {
    console.log('query data:', data)
});*/