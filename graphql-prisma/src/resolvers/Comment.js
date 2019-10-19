const Comment = {
    //parent - comment
    author(parent, args, {db}, info) {
        const authorId = parent.author;
        return db.users.find((user) => {
            return user.id === authorId;
        });
    },
    post(parent, args, {db}, info) {
        const postId = parent.post;
        return db.posts.find((post) => {
            return postId === post.id;
        });
    }
};

export default Comment;