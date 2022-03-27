const fs = require("file-system");
var slugify = require('slugify')

function Model_helper(){
}

Model_helper.prototype.shuffleArray = function(inputArray){
    inputArray.sort(()=> Math.random() - 0.5);
}

Model_helper.prototype.pagination_get_interval = function (page, nbResult, nb_product_by_page, nb_pagination_number_around){
    const nbTotalPage = Math.trunc(nbResult/nb_product_by_page);
    const nbPageAfterEnd = nbTotalPage - page;
    const nbPaginationNumber = (nb_pagination_number_around * 2) + 1;
    let result = []
    if(nbTotalPage < nbPaginationNumber - 1){
        for(let i = 0; i<=nbTotalPage; i++){
            result.push(i)
        }
        return result;
    }

    const remove = nb_pagination_number_around + (nbPageAfterEnd > nb_pagination_number_around ? 0 : nb_pagination_number_around - nbPageAfterEnd);
    const add = page <= nb_pagination_number_around ? nb_pagination_number_around - page : -1;

    for(let i = page + add - remove; i <= page + nbPaginationNumber + add - remove; i++){
        result.push(i+1)
    }
    return result;
}

Model_helper.prototype.ReadCategorieFileThenAddIds = function (categorieKey){
    return new Promise((resolve,reject) => {
        fs.readFile('./data/categories_data/categorie_' + categorieKey + '.json', 'utf8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

Model_helper.prototype.ParseCategorieData = function(){
    //ajouter categorie et id
    const fileList = fs.readdirSync("./data/categories_data");
    fileList.forEach((categoriePath)=>{
        let categorie = categoriePath.split('_');
        categorie.shift();
        categorie = categorie.join('_').slice(0,-5);
        fs.readFile('./data/categories_data/' + categoriePath,'utf8', function(err,data){
            if(err) console.log(err);
           data = JSON.parse(data);
           data.forEach((product,index)=>{
               product.categorie = categorie;
               product.id = index;
           });
           fs.writeFileSync('./data/categories_data/' + categoriePath, JSON.stringify(data));
        });
    });
}

Model_helper.prototype.getProductData = function(categorie,id){
    let data = fs.readFileSync('./data/categories_data/categorie_' + categorie + '.json');
    data = JSON.parse(data);
    return data.find((product) => {
        return product.id == id;
    })
}

module.exports = Model_helper;
