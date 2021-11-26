const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const CartServices = require("../services/cart_services");
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);




router.get('/', async (req,res) => {
    const cart = new CartServices(req.session.user.id);
    // getting all items from cart
    let items = await cart.getCart();

    // creating line items
    let lineItems = [];
    let meta = [];
    for (let item of items) {
        let lineItem = {
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
        'payment_method_types': ['card'],
        'line_items': lineItems,
        'success_url' : process.env.STRIPE_SUCCESS_URL,
        'cancel_url' : process.env.STRIPE_ERROR_URL,
        'metaData' : {
            'orders': metaData,
            'user_id': req.session.user.id
        }
    }
    // register the session
    let stripeSession = await Stripe.checkout.session.create(payment)
    res.render('checkout/checkout', {
        'sessionId' : stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
    
})

router.get('/success', function(req,res) {
    res.render('checkout/success')
})
router.get('/cancelled', function(req,res) {
    res.render('checkout/cancelled')
})


router.post('/process_payment', bodyParser.raw({type: 'application/json'}), async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

    } catch (e) {
        res.send({
            'error': e.message
        })
        console.log(e.message)
    }
    if (event.type == 'checkout.session.completed') {
        let stripeSession = event.data.object;
        console.log(stripeSession);
        // process stripeSession
    }
    res.send({ received: true });
})


module.exports = router;