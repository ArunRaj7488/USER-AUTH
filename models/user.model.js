const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const config = require('config')
const commonReg = {
  email: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/,
  date: /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/,
};

const UserSchema = mongoose.Schema({
  first_name: { type: String, required: [true, "User Name is required!"] },
  last_name: { type: String, required: false, default: "" },
  email: {
    type: String,
    required: [true, "User email is required!"],
    validate: {
      validator: function () {
        return commonReg.email.test(this.email);
      },
      message: function () {
        return "Invalid Email!";
      },
    },
  },
  dob: {
    type: Date,
    required: true,
    validate: {
      validator: function () {
        return new Date(this.dob).toISOString() <= new Date().toISOString;
      },
      message: function () {
        return "Invalid Date Of Birth";
      },
    },
  },
  mobile_number: { type: String, required: true},
  password: {type: String, required: true},
  description: { type: String, required: false, default: null},
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other']}
});


UserSchema.methods.generateAuthToken = function() {
return jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'))
}

const User = mongoose.model('users', UserSchema);

module.exports = User;