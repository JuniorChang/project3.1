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
    },
    name() {
        return this.hasMany('Products');
    }
});

const User = bookshelf.model('User', {
    tableName: 'users',
    Product : function() {
        return this.belongToMany(Product, 'cart_items');
    }
});

const CartItem = bookshelf.model('CartItem', {
    tableName:'cart_items',
    product() {
        return this.belongsTo('Product')
    },
    quantity() {
        return this.belongsTo('Product')
    },
    tableName: 'countries',
    country(){
        return this.belongsTo('Country')
    },
    
    tableName:'coffee_products',
    name() {
        return this.belongsTo('Product')
    },
    cost() {
        return this.belongsTo('Product')
    },
    
});

const CartCountry = bookshelf.model('getCartCountry', {
    tableName: 'countries',
    country(){
        return this.belongsTo('Country')
    }
})

const Owner = bookshelf.model('Owner', {
    tableName: 'owner'
})

module.exports = { Product, Country, User, CartItem, Owner, CartCountry };