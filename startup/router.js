const { EPERM } = require('constants');
const express = require('express');
const userRoutes = require('../routes/user.routes');


module.exports = (app) => {
    app.use(express.urlencoded({ extended: true}));
    app.use(express.json());

    app.use('/user', userRoutes);
}
