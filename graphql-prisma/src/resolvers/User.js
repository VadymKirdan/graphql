const User = {
    //parent - user
    posts(parent, args, {db}, info) {
        const userId = parent.id;
        return db.posts.filter((post) => {
            return post.author === userId;
        });
    },
    comments(parent, args, {db}, info) {
        const userId = parent.id;
        return db.comments.filter((comment) => {
            return comment.author === userId;
        });
    }
};

export default User;