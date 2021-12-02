const cartDataLayer = require('../dal/cart_items');
const product = require('../dal/products')
class CartServices {
    constructor(user_id) {
        this.user_id = user_id
    }

    async addToCart(productId, quantity) {
        let cartItem = await cartDataLayer.getCartItemByUserAndProduct(this.user_id, productId);
        if (cartItem) {
            return await cartDataLayer.updateQuantity(this.user_id, productId, cartItem.get('quantity') +1);
        } else {
            let newCartItem = cartDataLayer.createCartItem(this.user_id, productId, quantity);
            return newCartItem;
        }
    }

    async remove(productId) {
        return await cartDataLayer.removeFromCart(this.user_id, productId);
    }

    async setQuantity(productId, quantity){
        return await cartDataLayer.updateQuantity(this.user_id, productId, quantity)
    }

    async getCart() {
        let cartItems= await cartDataLayer.getCart(this.user_id);
        let cart =[]
        for(let k =0 ; k<cartItems.length; k++)
        {
            if(cartItems[k].user_id == this.user_id)
            {
                cart.push(cartItems[k])
            }
        }
       
        if(cart.length > 0)
        {
            for (let i =0 ; i<cart.length;i++)
            {
               
                let produtcs=await product.getProductbyId(cart[i].product_id)
                cart[i].name = produtcs.get('name')
                cart[i].cost = produtcs.get('cost')
                
            }
            return cart

        }
        else
        {
            return null
        }
        
    }

    async getCartCountry() {
        return await cartDataLayer.getCartCountry(this.user_id);
    }
}

module.exports = CartServices;