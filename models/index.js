const bookshelf = require('../bookshelf')

const Product = bookshelf.model('product', {
    tableName:'coffeeData'
});

module.exports = { Product };