const router = require('express').Router();

const { getAllUser, createUser, signUp } = require('../controller/user.controller');

router.get('/get',  getAllUser);
router.post('/create', createUser);
router.post('/login', signUp)

module.exports = router;