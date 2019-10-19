const users = [{ 
    id: '1',
    name: 'John',
    email: 'john@example.com'
}, {
    id: '2',
    name: 'Ivan',
    email: 'ivan@example.com',
    age: 20
}, {
    id: '3',
    name: 'Vasya',
    email: 'vasya@example.com'
}];

const posts = [{
    id: '1',
    title: 'first',
    body: 'first body',
    published: true,
    author: '1'
}, {
    id: '2',
    title: 'second',
    body: 'second body',
    published: false,
    author: '3'
}, {
    id: '3',
    title: 'third',
    body: 'third body',
    published: false,
    author: '3'
}];

const comments = [
    {id: '1', text: 'first comment', author: '2', post: '1'},
    {id: '2', text: 'second comment', author: '3', post: '1'},
    {id: '3', text: 'third comment', author: '2', post: '1'},
    {id: '4', text: 'fourth comment', author: '1', post: '3'}
];

const db = {
    users,
    posts,
    comments
};

export default db;