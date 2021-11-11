const express = require('express');
const router = express.Router();

const CartServices = require("../services/cart_services");
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = router;


router.get('/', async (req,res) => {
    const cart = new CartServices(req.session.user.id);
    // getting all items from cart
    let items = await cart.getCart();

    // creating line items
    let lineItems = [];
    let meta = [];
    for (let item of items) {
        const lineItem = {
            'name' : item.related('product').get('name'),
            'amount': item.related('product').get('cost'),
            'quantity': item.get('quantity'),
            'currency': "SGD"
        }
        if (item.related('product').get('image_url')) {
            lineItem['images'] = [item.related('product').get('image_url')]
        }
        lineItem.push(lineItem);
        // save the qty togehter with the product ID
        meta.push({
            'product_id':item.get('product_id'),
            'quantity': item.get('quantity')
        })
    }

    // creating stripe payment
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url : process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url : process.env.STRIPE_ERROR_URL,
        metaData : {
            'orders': metaData
        }
    }
    // register the session
    let stripeSession = await Stripe.checkout.session.create(payment)
    res.render('checkout/checkout', {
        'sessionId' : stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
    
})