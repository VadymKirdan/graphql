const Query = {
    users(parent, args, {db}, info) {
        return db.users;
    },
    posts(parent, args, {db}, info) {
        if (!args.query) {
            return db.posts;
        }
        return db.posts.filter((post) => {
            return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
        });
    },
    comments(parent, args, {db}, info) {
        return db.comments;
    }
};

export default Query;