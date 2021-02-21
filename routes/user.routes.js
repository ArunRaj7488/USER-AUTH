const router = require('express').Router();

const { getAllUser, createUser } = require('../controller/user.controller');

router.get('/get', getAllUser);
router.post('/create', createUser);

module.exports = router;