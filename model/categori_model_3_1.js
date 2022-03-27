const fs = require("file-system");
const async = require("async");
const Categories3 = require('../data/categories_3_5.js');
const Categorie_model_10_1 = require('../model/categorie_model_10_1');
const {promiseCallback} = require("async/internal/promiseCallback");
const categorie_model_10_1 = new Categorie_model_10_1();
const categories3 = Categories3;


function Categorie_model_3_1 (){
}

Categorie_model_3_1.prototype.getCategorieName = function(categories) {
    // prend categorie et trouve le nom associé si il existe
    for (const categorieKey in categories3) {
        if(categorieKey === categories) {
            return categories3[categorieKey];
        }
    }
    return false;
}

Categorie_model_3_1.prototype.promise = function (categories){
    return new Promise((resolve,reject) =>{
        categorie_model_10_1.getCategorie(categories,(result)=>{
            resolve(result);
        })
    })
}

Categorie_model_3_1.prototype.getCategorie = function(categories,callback) {
    let fileArray = [];
    for (const categorieKey in categories.compose) {
        fileArray.push(this.promise(categories.compose[categorieKey]));
    }
    Promise.all(fileArray).then((results) => {
        let allResults = []
        results.forEach((array)=>{
           allResults = allResults.concat(array);
        })
        callback(allResults);
    });
    /*async.map(fileArray, categorie_model_10_1.getCategorie, function (results, err) {
    });*/
}

module.exports = Categorie_model_3_1;