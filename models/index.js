const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName:'coffee_products',
    country(){
        return this.belongsTo('Country');
    },
});

const Country = bookshelf.model('Country',{
    tableName: 'countries',
    products(){
        return this.hasMany('Product');
    }
});

const User = bookshelf.model('User', {
    tableName: 'users'
});

const CartItem = bookshelf.model('CartItem', {
    tableName:'cart_items',
    product() {
        return this.belongsTo('Product')
    }
});

const Owner = bookshelf.model('Owner', {
    tableName: 'owner'
})

module.exports = { Product, Country, User, CartItem, Owner };