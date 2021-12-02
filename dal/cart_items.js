const {
    CartItem,
    CartCountry,
    Country,
} = require('../models');

const { get } = require('../routes/shoppingCart');

// const getCart = async (userId) => {
//     return await CartItem.collection()
//         .where({
//             'user_id': userId
//         }).fetch({
//             require: false,
//             withRelated: ['product']
//         });
// }

// const getCartItemByUserAndProduct = async (userId, productId) => {
//     return await CartItem.where({
//         'user_id': userId,
//         'product_id': productId
//     }).fetch({
//         require: false
//     });
// }

// async function createCartItem(userId, productId, quantity) {
//     let cartItem = new CartItem({
//         'user_id': userId,
//         'product_id': productId,
//         'quantity': quantity
//     })
//     await cartItem.save();
//     return cartItem;
// }

// async function removeFromCart(userId, productId) {
//     let cartItem = await getCartItemByUserAndProduct(userId, productId);
//     if (cartItem) {
//         await cartItem.destroy();
//         return true;
//     }
//     return false;
// }

// async function updateQuantity(userId, productId, newQuantity) {
//     let cartItem = await getCartItemByUserAndProduct(userId, productId);
//     if (cartItem) {
//         cartItem.set('quantity', newQuantity);
//         cartItem.save();
//         return true;
//     }
//     return false;
// }

 function getCartItemByUserAndProduct(userId, productId) {
    return new Promise(async (resolve) => {
        let cartItem = await CartItem.where({
            'user_id': userId,
            'product_id': productId
        }).fetch({
            'require': false
        })
        resolve(cartItem) ;
    })
   
}

async function createCartItem(userId, productId, quantity) {

    let cartItem = new CartItem({
        'user_id': userId,
        'product_id': productId,
        'quantity': quantity
    })
    await cartItem.save();
    return cartItem;
}

async function getCart(userId) {
    // to get more > 1 result, .collection
    // console.log(CartItem);
    let allCartItems = await CartItem.collection({
        'user_id': userId,
        // 'name': name,
        // 'product_id': productId,
        // 'quantity': quantity,
    
    }).fetch({
        'require': false,
        withRelated: ['product', 'product.country', 'name']
    })
    return allCartItems.serialize()
}

async function getCartCountry(country) {
    let allCartCountry = await CartCountry.collection({

    }).fetch({
        'require': false,
        withRelated: ['country']
    })
    return allCartCountry.serialize();
}
async function removeFromCart(userId, productId) {
    let cartItem = await getCartItemByUserAndProduct(userId, productId);
    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    return false;
}

async function updateQuantity(userId, productId, newQuantity) {
    
let cartItem = await getCartItemByUserAndProduct(userId, productId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        cartItem.save();
        return true;
    }
    return false;
}
// async function getProductById( productId) {
//     return new Promise(async (resolve) => {
//         let products = await product.getProductbyId(productId)
//         resolve(products) ;
//     })
   
// }
module.exports = {
    getCart,
    getCartItemByUserAndProduct,
    createCartItem,
    removeFromCart,
    updateQuantity,
    getCartCountry
}