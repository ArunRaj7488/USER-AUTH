const Joi = require('joi');

const User = require('../models/user.model');
const responseHandler = require('../utils/responseHandler');
const bcrypt = require('bcrypt')

const getAllUser = async(req, res) => {
    try{
    const user = await User.find();
    responseHandler({res, data: user})
    } catch( err) {
        responseHandler({ res, error, status: 503})
    }
};

const createUser = async(req, res) => {
    const { mobile_number, email, password } = req.body;
// check validation of Joi
const { error } = ValidateUSer(req.body);
if(error) return responseHandler({res, error: error.details[0].message, status:404});
// check of duplicate Data
 const user = await User.findOne({ $or: [{email}, {mobile_number}]});
 if(user) return responseHandler({ res, error: { message: "Email OR Mobile Number All ready exist for this user"}, status: 422});

 const salt = bcrypt.genSaltSync(10);
 const hashPassword = bcrypt.hashSync( password, salt);

 const new_user = await User.create({ ...req.body, password: hashPassword})
 const token = new_user.generateAuthToken();
 const { password: temp, ...newUserData } = new_user._doc
 responseHandler({ data: { user: newUserData, token}, res})
}

const ValidateUSer = (data) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string(),
        email: Joi.string().required(),
        mobile_number: Joi.string().required(),
        dob: Joi.date().required(),
        description: Joi.string(),
        gender: Joi.string().required(),
        password: Joi.string().required()
    })
    return schema.validate(data)
}


module.exports = {
    getAllUser, 
    createUser
}