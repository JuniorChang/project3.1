const bookshelf = require('../bookshelf')

const Product = bookshelf.model('coffeeData', {
    tableName:'coffeeData',
    country(){
        return this.belongsTo('Country');
    }
});

const Country = bookshelf.model('Country',{
    tableName: 'countries',
    products(){
        return this.hasMany('Product');
    }
});

module.exports = { Product, Country };