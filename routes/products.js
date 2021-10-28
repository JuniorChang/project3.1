const express = require("express");
const router = express.Router();
const {checkIfAuthenticated} = require('../middlewares/index');

// #1 import in the Product model
const {
    Product,
    Country
} = require('../models')

// import in the Forms
const {
    bootstrapField,
    createProductForm
} = require('../forms');

router.get('/', async (req, res) => {
    // #2 - fetch all the products (ie, SELECT * from products)
    let products = await Product.collection().fetch({
        withRelated: ['country']
    });
    res.render("products/index", {
        products: products.toJSON() // #3 - convert collection to JSON
    });
});


router.get('/create', checkIfAuthenticated, async (req, res) => {
    const allCountries = await Country.fetchAll().map((country)=>{
        return [country.get('id'), country.get('name')];
    })
    const productForm = createProductForm(allCountries);
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField),
        CL_NAME : process.env.CL_NAME,
        CL_API_KEY: process.env.CL_API_KEY,
        CL_PRESET : process.env.CL_UPLOAD_PRESET
    })
    
});

router.post('/create', checkIfAuthenticated, async (req, res) => {
    const allCountries = await Country.fetchAll().map((country_id)=>{
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


router.get('/:product_id/update', async (req, res) => {
    // retrieve the product
    const productId = req.params.product_id
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true
    });

    // fetch all the categories
    const allCountries = await Country.fetchAll().map((country) => {
        return [country.get('id'), country.get('name')];
    })
    const productForm = createProductForm(allCountries);

    // fill in the existing values
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.country_id.value = product.get('country_id');

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })

});

router.post('/:product_id/update', async (req, res) => {

    // fetch all the categories
    const allCountries = await Country.fetchAll().map((country) => {
        return [country.get('id'), country.get('name')];
    })
    // fetch the product that we want to update
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        required: true
    });

    // process the form
    const productForm = createProductForm(allCountries);
    productForm.handle(req, {
        'success': async (form) => {
            product.set(form.data);
            product.save();
            req.flash("success_messages", `${product.get('name')} has been updated`);
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField)
            })
        }
    });
});

router.get('/:product_id/delete', async (req, res) => {
    // fetch the product that we want to delete
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });

    res.render('products/delete', {
        'product': product.toJSON()
    })

});

router.post('/:product_id/delete', async (req, res) => {
    // fetch the product that we want to delete
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });
    await product.destroy();
    res.redirect('/products')
});


module.exports = router;