var express = require('express');
var router = express.Router();
const Chart_model = require("../model/chart_model");

router.post('/', function (req,res,next){
    const product_id = req.body.id;
    const product_categorie = req.body.categorie;
    const chart_model = new Chart_model(req);
    const product = chart_model.postChart(product_id, product_categorie);
    req.session.save((error)=> {
        if(error)console.log(error);
        res.send(product);
    });
});

router.get('/', function (req,res,next){
    const chart_model = new Chart_model(req);
    res.send(chart_model.getChart());
});

router.post('/plus', function (req,res,next){
    const id = req.body.id;
    const categorie = req.body.categorie;
    const chart_model = new Chart_model(req);
    chart_model.PlusChart(id, categorie);
    req.session.save((error)=> {
        if(error)console.log(error);
         res.send(true);
    });
});

router.post('/minus', function (req,res,next){
    const id = req.body.id;
    const categorie = req.body.categorie;
    const chart_model = new Chart_model(req);
    chart_model.MoinChart(id, categorie);
    req.session.save((error)=> {
        if(error)console.log(error);
        res.send(true);
    });
});

router.post('/delete', function (req,res,next){
    const id = req.body.id;
    const categorie = req.body.categorie;
    const chart_model = new Chart_model(req);
    chart_model.DeleteChart(id, categorie);
    req.session.save((error)=> {
        if(error)console.log(error);
        res.send(true);
    });
});


module.exports = router;
