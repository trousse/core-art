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

router.get('/contact', function (req, res, next){
    try{
        req.session.pageVisited++
        req.data.scripts.push('allping.js');
        const styles = ['footer_page.css', 'contact.css'];
        res.render('presentation', {title: 'Contact', styles: styles, Data: req.data});
    } catch (e){
        console.log(e)
    }
});

router.get('/presentation', function (req, res, next){
    try{
        req.session.pageVisited++
        const styles = ['footer_page.css'];
        req.data.scripts.push('allping.js');
        res.render('contact', {title: 'Presentation', styles: styles, Data: req.data});
    } catch (e){
        console.log(e)
    }
});

router.get('/mention_legal', function (req, res, next){
    try{
        req.session.pageVisited++
        req.data.scripts.push('allping.js');
        const styles = ['footer_page.css'];
        res.render('mention_legal', {title: 'Mention legal', styles: styles, Data: req.data});
    } catch (e){
        console.log(e)
    }
});

router.get('/condition_general', function (req, res, next){
    try{
        req.session.pageVisited++
        req.data.scripts.push('allping.js');
        const styles = ['footer_page.css'];
        res.render('condition_general', {title: 'Conditions general', styles: styles, Data: req.data});
    } catch (e){
        console.log(e)
    }
});

/* GET home page. */
router.get('/', function (req, res, next){
    try{
        req.session.pageVisited++
        req.data.scripts.push('allping.js');
        const styles = ['home.css'];
        res.render('home', {title: 'Home', styles: styles, Data: req.data});
    } catch (e){
        console.log(e)
    }
});

router.get('/goodbye', function (req, res, next){
    try{
        const styles = ['home.css'];
        req.data.scripts.push('allping.js');
        res.render('goodbye', {title: 'Goodbye', styles: styles, Data: req.data});
    } catch (e){
        console.log(e)
    }
});

router.get('/produit/:categorie/:id', function (req, res, next){
    try{
        req.session.pageVisited++
        const styles = ['product.css'];
        req.data.scripts.push('product.js');
        const model = new ModelHelper();
        const product = model.getProductData(req.params.categorie, req.params.id);
        res.render('product_page', {title: 'product page', styles: styles, Data: req.data, product: product});
    } catch (e){
        console.log(e);
    }
});

router.get('/valid_chart', function (req, res, next){
    try{
        req.session.pageVisited++
        req.data.scripts.push('allping.js');
        const styles = ['valid_chart.css'];
        const chart_model = new Chart_model(req);
        const chart = chart_model.getChart();
        res.render('valid_chart_page', {title: 'valid chart page', styles: styles, Data: req.data, chart: chart});
    } catch (e){
        console.log(e)
    }
})

router.get('/categorie/:categorie', function (req, res, next){
    try{
        setTimeout(()=>{
            req.session.reload(() => {
                req.session.pageVisited++
                req.session.clickMenu++;
                const styles = ["list_product.css"];
                req.data.scripts.push('catalogue.js');
                const page = parseInt(req.query.page || 1);
                const sendData = (req, res, data, categorie) => {
                    req.session.arrayData = data;
                    req.data.pagination = modelHelper.pagination_get_interval(page, data.length, 39, 4);
                    req.data.page = page;
                    req.data.categorieSlug = req.params.categorie;
                    try{
                        req.session.save((error) => {
                            if (error) console.log(error)
                            res.render('list_products', {
                                title: 'List product',
                                styles: styles,
                                Data: req.data,
                                categorie: data.slice((page - 1) * 39, page * 39),
                                categorieName: categorie.name
                            });
                        });
                    } catch (e){
                        console.log(e);
                    }
                }

                var categorie_model = {};

                if (req.data.Menu.highNbMenu && req.data.Menu.submenu){
                    categorie_model = new Categorie_model_10_5();
                } else if (req.data.Menu.highNbMenu && !req.data.Menu.submenu){
                    categorie_model = new Categorie_model_10_1();
                } else if (!req.data.Menu.highNbMenu && req.data.Menu.submenu){
                    categorie_model = new Categorie_model_3_5();
                } else if (!req.data.Menu.highNbMenu && !req.data.Menu.submenu){
                    categorie_model = new Categorie_model_3_1();
                }

                const categorie = categorie_model.getCategorieName(req.params.categorie);
                if (req.query.page && req.session.arrayData){
                    sendData(req, res, req.session.arrayData, categorie);
                } else{
                    if (categorie){
                        categorie_model.getCategorie(categorie, function (data, err){
                            if (typeof data != 'string'){
                                let allData = [];
                                data.map((cat) => {
                                    return JSON.parse(cat);
                                }).forEach((cat) => {
                                    allData = allData.concat(cat);
                                });
                                modelHelper.shuffleArray(allData);
                                sendData(req, res, allData, categorie);
                            } else{
                                data = JSON.parse(data);
                                sendData(req, res, data, categorie);
                            }
                        });
                    } else{
                        console.log(404);
                    }
                }
            });
        },500);
    } catch (e){
        console.log(e)
    }
});

/* GET auth page. */
router.get('/menu/:number', function (req, res, next){
    try{
        const number = atob(req.params.number)[0];
        if (Number.isInteger(parseInt(number)) && number <= 8){
            req.session.MenuNumber = number;
            req.session.save(() => {
                res.redirect('/');
            });
        } else{
            res.redirect('/');
        }
    } catch (e){
        console.log(e);
    }
});


module.exports = router;