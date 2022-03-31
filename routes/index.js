var express = require('express');
var router = express.Router();
var Categorie_model_10_5 = require('../model/categorie_model_10_5');
var Categorie_model_10_1 = require('../model/categorie_model_10_1');
var Categorie_model_3_5 = require("../model/categorie_model_3_5");
var Categorie_model_3_1 = require("../model/categori_model_3_1");
const {forEach} = require("async");
var ModelHelper = require("../helper/model_helper");
var Chart_model = require('../model/chart_model');

var modelHelper = new ModelHelper();


/* GET home page. */
router.get('/', function(req, res, next) {
  const styles = ['home.css'];
  res.render('home', { title: 'Home' ,  styles: styles, Data: req.data});
});

router.get('/produit/:categorie/:id',function (req,res,next){
  const styles = ['product.css'];
  try{
    const model = new ModelHelper();
    const product = model.getProductData(req.params.categorie, req.params.id);
    res.render('product_page', { title: 'product page', styles: styles, Data: req.data, product: product});
  }catch(e){
    console.log(e);
  }
});

router.get('/valid_chart',function (req, res, next){
  const styles = ['valid_chart.css'];
  const chart_model = new Chart_model(req);
  const chart = chart_model.getChart();
  res.render('valid_chart_page', { title: 'valid chart page', styles: styles, Data: req.data, chart: chart});
})

router.get('/categorie/:categorie',function(req, res, next) {
  const styles = ["list_product.css"];
  const page = req.query.page || 1;
  const sendData = (req,res,data,categorie) => {
    req.session.arrayData = data;
    req.data.pagination = modelHelper.pagination_get_interval(page, data.length, 39, 4);
    req.data.page = page;
    req.data.categorieSlug = req.params.categorie;
    try{
      res.render('list_products', { title: 'List product', styles: styles, Data: req.data, categorie: data.slice((page-1)*39,page*39), categorieName: categorie.name});
    }catch(e){
      console.log(e);
    }
  }


  var categorie_model = {};

  if(req.data.Menu.highNbMenu && req.data.Menu.submenu){ categorie_model = new Categorie_model_10_5(); }
  else if(req.data.Menu.highNbMenu && !req.data.Menu.submenu){ categorie_model = new Categorie_model_10_1(); }
  else if(!req.data.Menu.highNbMenu && req.data.Menu.submenu){ categorie_model = new Categorie_model_3_5(); }
  else if(!req.data.Menu.highNbMenu && !req.data.Menu.submenu){ categorie_model = new Categorie_model_3_1(); }

  const categorie = categorie_model.getCategorieName(req.params.categorie);
  if(req.query.page && req.session.arrayData){
    sendData(req, res, req.session.arrayData, categorie);
  }else{
    if(categorie){
      categorie_model.getCategorie(categorie, function (data,err) {
        if (typeof data != 'string') {
          let allData = [];
          data.map((cat) => { return JSON.parse(cat); }).forEach((cat) => {
            allData = allData.concat(cat);
          });
          modelHelper.shuffleArray(allData);
          sendData(req, res, allData, categorie);
        } else {
          data = JSON.parse(data);
          sendData(req, res, data, categorie);
        }
      });
    }else{
      console.log(404);
    }
  }
});

/* GET auth page. */
router.get('/auth', function(req, res, next) {
  if(req.session.code){
    res.redirect('/');
  }
  req.session.code = '1234';
  res.render('home', { title: 'Auth' , Data: req.data});
});

module.exports = router;

router.post('/chart', function (req,res,next){
  const product_id = req.body.id;
  const product_categorie = req.body.categorie;
  const chart_model = new Chart_model(req);
  const product = chart_model.postChart(product_id, product_categorie);
  res.send(product);
});

router.get('/chart', function (req,res,next){
  const chart_model = new Chart_model(req);
  res.send(chart_model.getChart());
});

router.post('/chart/plus', function (req,res,next){
  const id = req.body.id;
  const categorie = req.body.categorie;
  const chart_model = new Chart_model(req);
  chart_model.PlusChart(id, categorie);
  res.send(true);
});

router.post('/chart/minus', function (req,res,next){
  const id = req.body.id;
  const categorie = req.body.categorie;
  const chart_model = new Chart_model(req);
  chart_model.MoinChart(id, categorie);
  res.send(true);
});

router.post('/chart/delete', function (req,res,next){
  const id = req.body.id;
  const categorie = req.body.categorie;
  const chart_model = new Chart_model(req);
  chart_model.DeleteChart(id, categorie);
  res.send(true);
});

