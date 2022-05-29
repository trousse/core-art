var express = require('express');
var router = express.Router();
const Chart_model = require("../model/chart_model");

router.post('/', function (req, res, next){
    try{
        const product_id = req.body.id;
        const product_categorie = req.body.categorie;
        const chart_model = new Chart_model(req);
        req.session.reload(async function (err){
            const product = await chart_model.postChart(product_id, product_categorie);
            req.session.save((error) => {
                if (error) console.log(error);
                res.send(product);
            });
        });
    } catch (e){
        console.log(e)
    }
});

router.get('/', function (req, res, next){
    try{
        req.session.reload(async function (err){
            const chart_model = new Chart_model(req);
            res.send(await chart_model.getChart());
        });
    } catch (e){
        console.log(e)
    }
});

router.post('/plus', function (req, res, next){
    try{
        const id = req.body.id;
        const categorie = req.body.categorie;
        const chart_model = new Chart_model(req);
        req.session.reload(async function (err){
            await chart_model.PlusChart(id, categorie);
            req.session.save((error) => {
                if (error) console.log(error);
                res.send(true);
            });
        });
    } catch (e){
        console.log(e)
    }
});

router.post('/minus', function (req, res, next){
    try{
        const id = req.body.id;
        const categorie = req.body.categorie;
        const chart_model = new Chart_model(req);
        req.session.reload(async function (err){
            await chart_model.MoinChart(id, categorie);
            req.session.save((error) => {
                if (error) console.log(error);
                res.send(true);
            });
        });
    } catch (e){
        console.log(e)
    }
});

router.post('/delete', function (req, res, next){
    try{
        const id = req.body.id;
        const categorie = req.body.categorie;
        const chart_model = new Chart_model(req);
        req.session.reload(async function (err){
            await chart_model.DeleteChart(id, categorie);
            req.session.save((error) => {
                if (error) console.log(error);
                res.send(true);
            });
        });
    } catch (e){
        console.log(e)
    }
});

router.post('/delete/all', function (req, res, next){
    req.session.reload(async function (err){
        await chart_model.DeleteAll();
        req.session.save((error) => {
            if (error) console.log(error);
            res.send(true);
        });
    });
});


module.exports = router;
