const express = require('express');
const CartServices = require('../services/cart_services');
const router = express.Router();
router.get('/', async function(req,res){
    let cart = new CartServices(req.session.user.id);
    let cartContent = await cart.getCart();
    let cartCountry = await cart.getCartCountry();
    console.log(cartContent)
    console.log(cartCountry)
    // cart content map
        // each product/user id object, you will call api for product info by product id
        // adjust the return of object to have product infor
    res.render('carts/index', {
        'shoppingCart' : cartContent,
        'countryCart' : cartCountry
    
    })
})

router.get('/:product_id/add', async (req,res)=>{
     let cart = new CartServices(req.session.user.id);
    await cart.addToCart(req.params.product_id,1);
    req.flash('success_messages', 'You have added one to the cart');
    res.redirect('/carts');
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