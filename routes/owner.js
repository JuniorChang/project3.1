const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

const {
    Owner,
    Product
} = require('../models');

const dataLayer = require('../dal/products');

const { 
    checkIfOwner
} = require('../middlewares/index');

const {
    RegisterOwnerForm,
    ownerLoginForm,
    bootstrapField,
    createSearchForm
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
            req.flash("success_messages", "Owner Account Registered");
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
                'email': form.data.email
            }).fetch({
                require:false
            });
            if (!owner) {
                req.flash("error_messages", "Sorry, login details is wrong")
                res.redirect('/owner/ownerLogin');
            } else {
                if (owner.get('password') === getHashedPassword(form.data.password)) {
                    req.session.owner = {
                        id: owner.get('id'),
                        username: owner.get('username'),
                        email: owner.get('email')
                    }
                    req.flash("success_messages", "Welcome back Owner")
                    res.redirect('/owner/ownerProfile');
                } else {
                    req.flash("error_messages", "Sorry, login details is wrong")
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

router.get('/viewProducts',checkIfOwner, async(req, res) => {
    const allCountries = await dataLayer.getAllCountries();
    allCountries.unshift([0, '----']);

    let searchForm = createSearchForm(allCountries);
    let q = Product.collection();

    searchForm.handle(req, {
        'empty': async (form) => {
            let products = await q.fetch({
                withRelated: ['country']
            })
            res.render('products/index', {
                'products': products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'error': async (form) => {
            let products = await q.fetch({
                withRelated: ['category']
            })
            res.render('products/index', {
                'products': products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {
            if (form.data.name) {
                q = q.where('name', 'like', '%' + req.query.name + '%')
            }
            if (form.data.country_id && form.data.country_id != "0") {
                q = q.query('join', 'countries','country_id','countries.id')
                    .where('countries.id', 'like', '%' + req.query.country_id + '%')
            }
            if (form.data.min_cost) {
                q = q.where('cost', '>=', req.query.min_cost)
            }

            if (form.data.max_cost) {
                q = q.where('cost', '<=', req.query.max_cost);
            }

            let products = await q.fetch({
                withRelated: ['country']
            })
            res.render('products/index', {
                'products': products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
    })
});


router.get('/create', checkIfOwner, async (req, res) => {
    const allCountries = await Country.fetchAll().map((country) => {
        return [country.get('id'), country.get('name')];
    })
    const productForm = createProductForm(allCountries);
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })

});

router.post('/create', checkIfOwner, async (req, res) => {
    const allCountries = await Country.fetchAll().map((country_id) => {
        return [country_id.get('id'), country_id.get('name')];
    })
    const productForm = createProductForm(allCountries);
    productForm.handle(req, {
        'success': async (form) => {
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            product.set('country_id', form.data.country_id);
            await product.save();
            req.flash("success_messages", `New Product ${product.get('name')} has been created`);
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
});



module.exports = router;