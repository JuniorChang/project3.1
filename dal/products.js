// import the product model

const {Product, Country} = require('../models/index');

const getAllCountries = async () => {
    return await Country.fetchAll().map((country)=>{
        return [country.get('id'), country.get('name')];
    })
}


const getProductById = async () => {
    return await Product.where({
        'id': parseInt(productID)
    }).fetch({
        require: true,
        withRelated: ['country']
    });
}

module.exports = {
    getAllCountries, getProductById
}