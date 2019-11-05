import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({userId: userId}, 'thisisasecret', {expiresIn: '7 days'}) 
}

export default generateToken;