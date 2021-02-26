const Joi = require('joi');

const User = require('../models/user.model');
const responseHandler = require('../utils/responseHandler');
const bcrypt = require('bcrypt')


// Get all User 
const getAllUser = async(req, res) => {
    try{
    const user = await User.find();
    responseHandler({res, data: user})
    } catch( err) {
        responseHandler({ res, error, status: 503})
    }
};

// Add new user
const createUser = async(req, res) => {
    try{
    const { mobile_number, email, password } = req.body;
// check validation of Joi
const { error } = validateUSerData(req.body);
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
    } catch(error) {
        responseHandler({ res, error, status: 501 })
    }
};

// Login user
const signUp = async(req, res) => { 
    try{
        const { error } = validationLoginData(req.body);
        if(error) return responseHandler({ res, error: error.details[0].message, status: 401})

        const { email, password } = req.body;

        const user = await User.findOne({ email});
        if(!user) return responseHandler({ res, error: { message: "Invalid email or password!.."}, status:401});

        // match password
        const checkPassword = bcrypt.compareSync( password, user.password);

        if(!checkPassword) return responseHandler({ res, error: { message: "Invalid Password!"}})

        const token = user.generateAuthToken();
        const { password: temp, ...newUserData }  =  user._doc
        responseHandler({ data: { user: newUserData, token}, res});

    }catch( error){
        responseHandler({ res, error, status: 501})
    }

}

// validation for create User Data
const validateUSerData = (data) => {
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

// validation for login

const validationLoginData = (data) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    return schema.validate(data);
}


module.exports = {
    getAllUser, 
    createUser, 
    signUp
}