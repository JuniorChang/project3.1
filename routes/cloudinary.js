const express = require('express');
const router = express.Router();

const cloudinary = require('cloudinary');

router.get('/sign', async(req,res)=>{
    // get the params we are sending to cloudinary
    const params_to_sign = JSON.parse(req.query.params_to_sign);

    // get our cloudinary api secret key from the .env 
    const apiSecret = process.env.CLOUDINARY_API_SECRET_KEY;

    // get the signature, aka CSRF
    const signature = cloudinary.utils.api_sign_request(params_to_sign, apiSecret);
        res.send(signature);
})

module.exports = router;