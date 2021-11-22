const express = require('express');
const router = express.Router();

const CartServices = require('../services/cart_services');

router.get('/', async(req,res)=>{
    let cart = new CartServices(req.session.user.id);
    res.render('carts/index', {
        'shoppingCart' : (await cart.getCart()).toJSON()
    })
})

router.get('/:product_id/add', async (req,res)=>{
    let cart = new CartServices(req.session.user.id);
    await cart.addToCart(req.params.product_id,1);
    req.flash('success_messages', 'You have added one to the cart')
    res.redirect('/products')
})

router.get('/:product_id/remove', async(req,res)=>{
    let cart = new CartServices(req.session.user.id);
    await cart.remove(req.params.product_id);
    req.flash("success_mesages", "Item has been removed");
    res.redirect('/carts');
})

router.post('/:product_id/quantity/update', async(req,res)=>{
    let cart = new CartServices(req.session.user.id);
    await cart.setQuantity(req.params.product_id, req.body.newQuantity);
    req.flash("success_messages", "Quantity updated")
    res.redirect('/carts');
})


module.exports = router;