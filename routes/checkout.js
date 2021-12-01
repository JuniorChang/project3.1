const express = require('express');
const CartServices = require("../services/cart_services");
const router = express.Router();
const Stripe = require('stripe')(process.env.STRIPE_KEY_SECRET);
const bodyParser = require('body-parser');


router.get('/', async function (req,res) {
    try{
        let lineItems = [];
        let meta = [];
    
        let cart = new CartServices(req.session.user.id);
        // getting all items from cart
        let items = await cart.getCart();
        
        // creating line items
        
        for (let item of items) {
            let lineItem = {
                'name' : item.name,
                'amount': item.cost,
                'quantity': item.quantity,
                'currency': "SGD"
            }
            // if (item.image_url) {
            //     lineItem['images'] = [item.related('product').get('image_url')]
            // }
            lineItems.push(lineItem);
            // save the qty togehter with the product ID
            meta.push({
                'product_id':item.product_id,
                'quantity': item.quantity
            })
        }
    
        // creating stripe payment
        let metaData = JSON.stringify(meta);
        const payment = {
            'payment_method_types': ['card'],
            'line_items': lineItems,
            'success_url' : process.env.STRIPE_SUCCESS_URL,
            'cancel_url' : process.env.STRIPE_ERROR_URL
            // 'metaData' : {
            //     'orders': metaData,
            //     'user_id': req.session.user.id
            // }
        }
        // register the session
        let stripeSession = await Stripe.checkout.sessions.create(payment)
        res.render('checkout/checkout', {
            'sessionId' : stripeSession.id,
            'publishableKey': process.env.STRIPE_KEY_PUBLISHABLE
        })
        
    }
    catch(err)
    {
        console.log(err)
    }
  
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