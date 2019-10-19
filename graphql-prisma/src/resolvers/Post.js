const Post = {
    //parent - post
    author(parent, args, {db}, info) {
        const authorId = parent.author;
        return db.users.find((user) => {
            return user.id === authorId;
        });
    },
    comments(parent, args, {db}, info) {
        const postId = parent.id;
        return db.comments.filter((comment) => {
            return comment.post === postId;
        });
    }
};

export default Post;