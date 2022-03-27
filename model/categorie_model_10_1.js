const async = require("async");
const ModelHelper = require("../helper/model_helper");
const Categories10 = require('../data/categories_10_5.js');

const categories10 = Categories10;
const modelHelper = new ModelHelper();

function Categorie_model_10_1 (){
}

Categorie_model_10_1.prototype.getCategorie = function(categorie,callback) {
    let fileArray = [];
    for (const categorieKey in categorie.compose) {
        fileArray.push(modelHelper.ReadCategorieFileThenAddIds(categorieKey));
    }
    Promise.all(fileArray).then((resultat) => {
            callback(resultat,false);
    });
}

Categorie_model_10_1.prototype.getCategorieName = function (categorie){
    // prend categorie et trouve le nom associé si il existe
    for (const categorieKey in categories10) {
        if(categorieKey === categorie) return {name: categories10[categorieKey].name, compose: categories10[categorieKey].compose};
    }
    return false;
}

module.exports = Categorie_model_10_1;