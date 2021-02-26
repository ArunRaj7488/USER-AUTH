const jwt = require('jsonwebtoken');
const config = require('config');
const responseHandler = require('../utils/responseHandler');
const User = require('../models/user.model');

const UserAuth = async(req, res, next) => {
    try{
        const token = req.header('x-auth-token');
    if(!token) return responseHandler({ res, error: {message:'Access Denied! Token Not provided..'}, status:401})

    const decode = jwt.verify(token, config.get('jwtPrivateKey'));
    const userData = await User.findById(decode._id)
    if(!userData) return responseHandler({res, error: { message: 'Invalid User!/ User Not Found'}, status: 404})

    req._id = decode._id;
    req.user = userData;
    next();

    } catch(error){
        responseHandler({ res, error, status: 501 })
    }

}

module.exports = {
    UserAuth
}