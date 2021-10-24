const bookshelf = require('../bookshelf')

const Product = bookshelf.model('coffeeData', {
    tableName:'coffeeData'
});

module.exports = { Product };