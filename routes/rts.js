const express = require('express');
const router = express.Router();

const {blogPostSync, blogPostId} = require('../controllers/blog');
const { signUp, verifyOTP } = require('../controllers/signUp')

router.get('/blogpost', blogPostSync)
router.get('/blogpost/:id', blogPostId);
router.post('/register', signUp);
router.post('/verify-otp', verifyOTP);

module.exports = {router}