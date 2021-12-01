// import the product model

const {Product, Country} = require('../models/index');

// const getAllCountries = async () => {
//     return await Country.fetchAll().map((country)=>{
//         return [country.get('id'), country.get('name')];
//     })
// }


// const getProductById = async () => {
//     return await Product.where({
//         'id': parseInt(productID)
//     }).fetch({
//         require: true,
//         withRelated: ['country']
//     });
// }

// module.exports = {
//     getAllCountries, getProductById
// }

 function getProductbyId(productId) {
    return new Promise(async (resolve) => {
        let product = await Product.where({
            'id': productId
        }).fetch({
            'require': true,
            'withRelated':['country']
        })
        resolve (product);
    })
  
}

async function getAllCountries() {
    let allCountries = await Country.fetchAll().map(function (country) {
        return [country.get('id'), country.get('name')]
    })
    return allCountries;
}

async function getAllProducts(){
    return await Product.fetchAll();
}


module.exports = {
    getProductbyId,
    getAllCountries,
    getAllProducts
}