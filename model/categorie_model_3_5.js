const async = require("async");
var ModelHelper = require("../helper/model_helper");
const Categories3 = require('../data/categories_3_5.js');
const categories3 = Categories3;
const modelHelper = new ModelHelper();

function Categorie_model_3_5 (){
}

Categorie_model_3_5.prototype.getCategorieName = function(categorie){
    // prend categorie et trouve le nom associé si il existe
    for (const categorieKey in categories3) {
        for (const subCategorie in categories3[categorieKey].compose) {
            if(subCategorie === categorie){
                return categories3[categorieKey].compose[subCategorie];
            }
        }
    }
    return false;
}

Categorie_model_3_5.prototype.getCategorie = function(categorie,callback) {
    let fileArray = [];
    for (const categorieKey in categorie.compose) {
        fileArray.push(modelHelper.ReadCategorieFileThenAddIds(categorieKey));
    }
    Promise.all(fileArray).then((results)=>{
            callback(results,false);
    });
}

module.exports = Categorie_model_3_5;