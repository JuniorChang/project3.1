const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

const {
    Owner, User
} = require('../models');

const {
    RegisterOwnerForm,
    ownerLoginForm,
    bootstrapField
} = require('../forms');

router.get('/ownerRegister', (req, res) => {
    const registerForm = RegisterOwnerForm();
    res.render('owner/ownerRegister', {
        'form': registerForm.toHTML(bootstrapField)
    })
})

router.post('/ownerRegister', (req,res) => {
    const registerForm = RegisterOwnerForm();
    registerForm.handle( req, {
        success: async(form) => {
            const owner = new Owner({
                'username':form.data.username,
                'password':getHashedPassword(form.data.password),
                'email': form.data.email
            });
            await owner.save();
            req.flash("success_messages", "Owner Account Regsitered");
            res.redirect('/owner/ownerLogin')
        },
        'error': (form) =>{
            res.render('owner/ownerRegister', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
});


router.get('/ownerLogin', (req,res) =>{
    const loginForm = ownerLoginForm();
    res.render('owner/ownerLogin', {
        'form': loginForm.toHTML(bootstrapField)
    })
});

router.post('/ownerLogin', async(req,res) => {
    const loginForm = ownerLoginForm();
    loginForm.handle(req, {
        'success': async(form) => {
            let owner = await Owner.where({
                'email': from.data.email
            }).fetch({
                require:false
            });

            if (!owner) {
                req.flash("error_messages", "Sorry, login details is wrong")
                res.redirect('/owner/ownerLogin');
            } else {
                if (owner.get(password) === getHashedPassword(form.data.password)) {
                    res.session.user = {
                        id: owner.get('id'),
                        username: owner.get('username'),
                        email: owner.get('email')
                    }
                    res.flash("success_messages", "Welcome back Owner")
                    res.redirect('/owner/profile');
                } else {
                    res.flash("error_messages", "Sorry, login details is wrong")
                    res.redirect('/owner/ownerLogin')
                }
            }
        },
        'error': (form) => {
            req.flash("error_messages", "There are some problems logging in. Please try again")
            res.render('owner/ownerLogin',{
                'form': form.toHTML(bootstrapField)
            })
        }
    })
});


module.exports = router;