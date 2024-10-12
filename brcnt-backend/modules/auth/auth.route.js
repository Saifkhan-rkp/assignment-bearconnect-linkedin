const authM = require('../../middleware/auth.middleware');
const { login, register, getUser } = require('./auth.controller');

const router = require('express').Router();


router.get("/user/self", authM, getUser)
.post("/register", register)
.post("/login", login);


module.exports = router;