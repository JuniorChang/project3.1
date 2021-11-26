const {
    CartItem,
    CartCountry
} = require('../models');

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

async function getCartItemByUserAndProduct(userId, productId) {
    let cartItem = await CartItem.where({
        'user_id': userId,
        'product_id': productId
    }).fetch({
        'require': false
    })
    return cartItem;
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

async function getCart(userId, name, productId, quantity) {
    // to get more > 1 result, .collection
    // console.log(CartItem);
    let allCartItems = await CartItem.where({
        // 'user_id': userId,
        // 'name': name,
        // 'product_id': productId,
        // 'quantity': quantity,

    }).fetchAll({
        'require': false,
        withRelated: ['product', 'product.country', 'name', 'quantity']
    })
    return allCartItems.serialize();
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

module.exports = {
    getCart,
    getCartItemByUserAndProduct,
    createCartItem,
    removeFromCart,
    updateQuantity,
    getCartCountry
}