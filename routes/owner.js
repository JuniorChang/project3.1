const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (passowrd) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

const {
    Owner
} = require('../models');

const {
    RegisterOwnerForm,
    bootstrapField
} = require('../forms');

router.get('/register', (req, res) => {
    const registerForm = RegisterOwnerForm();
    res.render('owner/register', {
        'form': registerForm.toHTML(bootstrapField)
    })
})

module.exports = router;