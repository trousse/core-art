var express = require('express');
var router = express.Router();
var ModelHelper = require("../helper/model_helper");
const fs = require("file-system");
const Axios = require('axios');
var imageSize = require('image-size');


async function downloadImage(url, filepath) {
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    fs.writeFileSync(filepath, "");
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath)); 
    });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
   model = new ModelHelper();
   model.ParseCategorieData();
   console.log('parsed');
});

function promise(categoriePath){
	return new Promise((resolve,reject) =>{
          fs.readFile('./data/categories_data/' + categoriePath,'utf8', function(err,data){
        	   data = JSON.parse(data);
        	   resolve(data);
        })
    })
}

router.get('/links', function(req,res,next){

    const fileList = fs.readdirSync("./data/categories_data");
     let fileArray = [];
    fileList.forEach((categoriePath)=>{
		  fileArray.push(promise(categoriePath));
    })
  
        Promise.all(fileArray).then((results) => {
           
            results.forEach((file)=>{
            	file.forEach((result)=>{
                    fs.access("./public/images/products/"+result.categorie+"_"+result.id+".jpg",fs.constants.F_OK,(err)=>{
                        if(err){
                             fs.open("./data/missingPhoto.csv","a", function(err, fd) {
                            let buffer = new Buffer.from(result.categorie + ";" + result.id + ";" + result.photo+"\n");
                            fs.write(fd, buffer, 0, buffer.length, 
                                null, function(err,writtenbytes) {
                            if(err) {
                                console.log('Cant write to file');
                            }else {
                                console.log(writtenbytes +
                                    ' characters added to file');
                            }
                        })
                            })
                        }
        		 });
            })
        });
    })
})

router.get('/count',function(req,res,next){
	var nb = 0;

    const fileList = fs.readdirSync("./data/categories_data");
	     let fileArray = [];
    fileList.forEach((categoriePath)=>{
		  fileArray.push(promise(categoriePath));
    })
  
        Promise.all(fileArray).then((results) => {
        	        results.forEach((file)=>{
        	file.forEach((result)=>{
        		nb++;
        	})
        	 console.log(nb);
        })
    
    })
})


router.get('/images', function(req,res,next){
    const files = fs.readdirSync("./public/images/products");
    let nb = 0
    files.forEach((file)=>{
        if(file !== ".DS_Store"){
            let imageDimensions = imageSize('./public/images/products/'+file);

            if(Math.abs((imageDimensions.width/imageDimensions.height)-1) > 0.1) console.log(file);
        }
    })
})

module.exports = router;
