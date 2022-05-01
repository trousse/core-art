var express = require('express');
const fs = require("file-system");
const Chart_model = require("../model/chart_model");
var router = express.Router();

router.post('/click', function (req,res,next){
    setTimeout(()=>{
        req.session.reload(function(err) {
            req.session.click++;
            console.log(req.session.click)
            req.session.save(()=>{
                res.send(true);
            });
        })
    },134);
});

router.post('/clickMenu', function (req,res,next){
    setTimeout(()=>{
        req.session.reload(function(err) {
            req.session.clickMenu++;
            console.log(req.session.clickMenu)
            req.session.save(()=>{
                res.send(true);
            });
        })
    },52)
});

/*router.post("/valid",function(req,res,next){
    const chart_model = new Chart_model(req);
    fs.open("./data/navigation_info.csv","a", function(err, fd) {
        const nbChart = chart_model.getChart().length;
        const totalPrice = chart_model.getTotal();
        const ip = req.session.ip;
        const version = req.session.MenuNumber;
        const horodateur = new Date(req.session.connectDateTime).toString();
        const timePass = new Date(Date.now() - req.session.connectDateTime);
        const timePassString = timePass.getHours()-1 + ':' +timePass.getMinutes() + ':' + timePass.getSeconds();
        const nbClick = req.session.click;
        const nbPageVisited = req.session.pageVisited;
        const nbMenu = req.session.clickMenu;

        let buffer = new Buffer.from(version + ";" + horodateur + ";" + timePassString + ";" + nbClick + ";" + nbPageVisited + ";" +nbMenu + ";"+ nbChart + ";" + totalPrice + "€;" + ip + "\n");
        fs.write(fd, buffer, 0, buffer.length,
            null, function(err,writtenbytes) {
                req.session.destroy();
                if(err) {
                    console.log('Cant write to file');
                }else {
                    console.log(writtenbytes +
                        ' characters added to file');
                }
            })
    });
    res.send(true);
});*/

module.exports = router;