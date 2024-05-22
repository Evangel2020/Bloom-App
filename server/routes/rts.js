const express = require('express');
const router = express.Router();

const {blogPostSync, blogPostId} = require('../controllers/blog');
const { signUp, verifyOTP } = require('../controllers/signUp');
const {loginController} = require('../controllers/login');

router.get('/blogpost', blogPostSync)
router.get('/blogpost/:id', blogPostId);
router.post('/register', signUp);
router.get('/loginUser', loginController);
router.post('/verify-otp', verifyOTP);

module.exports = {router}