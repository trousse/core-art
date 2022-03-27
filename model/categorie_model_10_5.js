const Categories10 = require('../data/categories_10_5.js');
const categories10 = Categories10;
const ModelHelper = require("../helper/model_helper");

const modelHelper = new ModelHelper();

function Categorie_model_10_5 (){
}

Categorie_model_10_5.prototype.getCategorieName = function (categorie){
    // prend categorie et trouve le nom associé si il existe
    for (const categorieKey in categories10) {
        for (const categorie_name in categories10[categorieKey].compose) {
            if(categorie_name === categorie) return {name: categories10[categorieKey].compose[categorie_name],compose: categorie};
        }
    }

    return false;
}

Categorie_model_10_5.prototype.getCategorie = function(categorie,callback){

        modelHelper.ReadCategorieFileThenAddIds(categorie.compose).then((data)=>{
                callback(data,false);
        }).catch((err)=>{
            callback(false,err);
        });

}

module.exports = Categorie_model_10_5;